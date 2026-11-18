type CatalogEntry = {
    id: string;
    code: string;
    name: string;
    version: string;
};

export type SeatingArea = CatalogEntry;

export type SeatingSession = {
    id: string;
    openedAt: string;
    version: string;
};

export type SeatingTable = CatalogEntry & {
    areaId: string;
    session: SeatingSession | null;
};

export type SeatingBoard = {
    areas: readonly SeatingArea[];
    tables: readonly SeatingTable[];
};

type CatalogInput = { code: string; name: string };
type EntityRef = { id: string; version: string };

export type SeatingChange =
    | { kind: "saveArea"; input: CatalogInput; existing?: EntityRef }
    | {
          kind: "saveTable";
          input: CatalogInput & { areaId: string };
          existing?: EntityRef;
      }
    | { kind: "archiveArea" | "archiveTable"; existing: EntityRef }
    | { kind: "openSession"; tableId: string }
    | { kind: "closeSession"; session: EntityRef }
    | {
          kind: "transferSession";
          session: EntityRef;
          targetTableId: string;
          reason: string;
      };

// UI data model. The HIE-2.1 adapter will translate API responses into it.
export interface SeatingGateway {
    load(signal: AbortSignal): Promise<SeatingBoard>;
    apply(change: SeatingChange): Promise<void>;
}

// The gateway maps backend problem codes to these UI reasons.
const messages = {
    duplicateCode: "Mã đã được sử dụng. Vui lòng nhập mã khác.",
    invalidInput: "Kiểm tra lại các trường bắt buộc và độ dài nội dung.",
    areaHasTables: "Hãy chuyển hoặc lưu trữ các bàn trong khu vực trước.",
    tableOccupied: "Bàn đang dùng. Hãy chọn bàn trống hoặc tải lại sơ đồ.",
    stale: "Dữ liệu đã thay đổi. Hãy đóng biểu mẫu và tải lại sơ đồ.",
} as const;

export class SeatingFailure extends Error {
    constructor(readonly reason: keyof typeof messages) {
        super(messages[reason]);
    }
}

export function describeSeatingFailure(error: unknown) {
    return error instanceof SeatingFailure
        ? error.message
        : "Không thể xử lý yêu cầu. Vui lòng thử lại.";
}
