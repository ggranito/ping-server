class SuccessType {
    private readonly '' = Symbol()
}

export const Success = new SuccessType()

export function isSuccess (value: any) : value is SuccessType {
    return value instanceof SuccessType
}
