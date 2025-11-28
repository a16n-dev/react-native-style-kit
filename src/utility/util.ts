type Mapping<M extends Record<string, readonly string[]>, K extends string, V> = {
  [P in keyof M as `${P & string}_${K}`]: {
    [Prop in M[P][number]]: V;
  };
};

export type MappingFromScale<
  M extends Record<string, readonly string[]>,
  Scale extends Record<string, number | string>,
> = UnionToIntersection<
  { [K in keyof Scale & string]: Mapping<M, K, Scale[K]> }[keyof Scale & string]
>;

export type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (
  x: infer I
) => any
  ? I
  : never;
