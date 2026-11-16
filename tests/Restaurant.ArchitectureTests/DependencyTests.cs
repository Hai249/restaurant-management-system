using System.Xml.Linq;
using Xunit;

namespace Restaurant.ArchitectureTests;

public sealed class DependencyTests
{
    private static readonly string[] Modules =
    [
        "Identity", "Seating", "Catalog", "Sales", "Fulfillment",
        "Billing", "Inventory", "SalesDay", "Audit", "Reporting"
    ];

    [Fact]
    public void Every_module_has_four_isolated_projects()
    {
        var root = FindRoot();
        foreach (var module in Modules)
        {
            var contractsPath = Path.Combine(root, "src", "Modules", module,
                $"Restaurant.Modules.{module}.Contracts", $"Restaurant.Modules.{module}.Contracts.csproj");
            if (File.Exists(contractsPath))
            {
                var contracts = XDocument.Load(contractsPath);
                Assert.Empty(contracts.Descendants("ProjectReference"));
                Assert.Empty(contracts.Descendants("PackageReference"));
                Assert.Empty(contracts.Descendants("FrameworkReference"));
            }
            foreach (var layer in new[] { "Domain", "Application", "Infrastructure", "Presentation" })
            {
                var path = Path.Combine(root, "src", "Modules", module,
                    $"Restaurant.Modules.{module}.{layer}", $"Restaurant.Modules.{module}.{layer}.csproj");
                Assert.True(File.Exists(path), $"Missing project: {path}");
                var project = XDocument.Load(path);
                var references = project.Descendants("ProjectReference")
                    .Select(x => Path.GetFileNameWithoutExtension(x.Attribute("Include")!.Value.Replace('\\', '/')))
                    .ToArray();
                var allowed = layer switch
                {
                    "Domain" => Array.Empty<string>(),
                    "Application" => new[] { $"Restaurant.Modules.{module}.Domain" },
                    "Infrastructure" => new[] { $"Restaurant.Modules.{module}.Domain", $"Restaurant.Modules.{module}.Application" },
                    "Presentation" => new[] { $"Restaurant.Modules.{module}.Application" },
                    _ => throw new InvalidOperationException()
                };
                Assert.Equal(allowed.Order(), references.Order());
                // Names alone are insufficient: a same-named project outside the module must not pass.
                foreach (var reference in project.Descendants("ProjectReference"))
                {
                    var actual = Path.GetFullPath(Path.Combine(Path.GetDirectoryName(path)!,
                        reference.Attribute("Include")!.Value.Replace('\\', Path.DirectorySeparatorChar)));
                    var expected = Path.Combine(root, "src", "Modules", module,
                        Path.GetFileNameWithoutExtension(actual), Path.GetFileName(actual));
                    Assert.Equal(Path.GetFullPath(expected), actual);
                }
                if (layer is "Domain" or "Application")
                {
                    Assert.Empty(project.Descendants("PackageReference"));
                    Assert.Empty(project.Descendants("FrameworkReference"));
                }
            }
        }
    }

    [Fact]
    public void No_module_uses_shared_build_files_to_bypass_reference_rules()
    {
        var root = FindRoot();
        var moduleRoot = Path.Combine(root, "src", "Modules");
        Assert.True(Directory.Exists(moduleRoot), "Module structure has not been created.");
        Assert.DoesNotContain(Directory.EnumerateFiles(moduleRoot, "*.props", SearchOption.AllDirectories),
            p => !p.Contains($"{Path.DirectorySeparatorChar}obj{Path.DirectorySeparatorChar}"));
        Assert.Empty(XDocument.Load(Path.Combine(root, "Directory.Build.props")).Descendants("ProjectReference"));
    }

    private static string FindRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            if (File.Exists(Path.Combine(directory.FullName, "Directory.Build.props")))
            {
                return directory.FullName;
            }
            directory = directory.Parent;
        }
        throw new DirectoryNotFoundException("Repository root was not found.");
    }
}
