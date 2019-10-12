export function Nominal<T, Identifier extends string>() {
    const identifier = Symbol()
    return class Type {
        private readonly '__identifier': Identifier;
        static fromValue<Cls extends typeof Type>(this:Cls, value: T) { 
          return this.validate(value) as any as InstanceType<Cls>; 
        }

        //Override to add custom validation logic
        protected static validate(value: T) : T {
            return value
        }

        static toValue<Cls extends typeof Type>(this:Cls, nominal: InstanceType<Cls>) {
          return nominal as any as T 
        }

        static Type: Type;
    }
}