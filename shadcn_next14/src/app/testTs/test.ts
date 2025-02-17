export function calc_moving_avg() {
  function calc_moving_avg(size: number, vect: number[], window_size: number): [number, number[]] {
    // 當 window_size 為 0 時，直接返回輸入數列
    if (window_size === 0) {
        return [size, [...vect]];
    }

    let result: number[] = [];
    // 計算可以形成多少個移動平均
    let n = size - window_size + 1;

    // 遍歷數列，計算每個窗口內的平均值
    for (let i = 0; i < n; i++) {
        let sum = 0;
        // 計算當前窗口內的數值總和
        for (let j = i; j < i + window_size; j++) {
            sum += vect[j];
        }
        // 將窗口內數值的平均值加入結果陣列，並進行四捨五入
        result.push(Math.round(sum / window_size));
    }

    // 返回計算出的移動平均個數和結果陣列
    return [n, result];


  }
  console.log(calc_moving_avg(4, [1, 2, 3, 4], 3));  // 應該輸出: [2, [2, 3]]
  console.log(calc_moving_avg(4, [1, 2, 3, 4], 2));  // 應該輸出: [3, [2, 3, 4]]


}



export function mappedTypes() {
// 因為 type 支援型別運算，因此可以進行 映射型別轉換：
// [K in keyof T]：這是一種 映射類型（Mapped Type）
type User = {
  name: string;
  age: number;
};
  // interface ReadonlyOptional<T> {
  //   readonly [K in keyof T]?: T[K]; // ❌ TypeScript 會報錯，因為 interface 不支援這種語法
  // }

type ReadonlyOptional<T> = {
  //[K in keyof T] 的 K 就是 User 類型的每個屬性名，分別為 name 和 age
  //T[K] 就是 User 類型中每個屬性對應的類型，分別是 string 和 number。
  //? 表示該屬性是可選的，你可以選擇是否設置該屬性。如果不設置，該屬性就是 undefined
  readonly [K in keyof T]?: T[K];
};
type ReadonlyOptionalUser = ReadonlyOptional<User>;
//這會展開為：
// type ReadonlyOptionalUser = {
//   readonly name?: string;
//   readonly age?: number;
// };
//實際運用：
const user1: ReadonlyOptionalUser = { name: "Alice" };
// `name` 是可選的，可以不設置
const user2: ReadonlyOptionalUser = { name: "Alice", age: 30 };

// 如果設置了 `name` 或 `age`，它們是 readonly 的，不能再修改
//user1.name = "Bob";  // Error: Cannot assign to 'name' because it is a read-only property.
}

export function structuralTyping() {
  
  interface Point {
    x: number;
    y: number;
  }
  let point_1: Point = { x: 1, y: 2 }; // 正確，符合 Point 結構
  const point_2 = { c:9,x: 1, y: 2 ,s:4 };// 匹配 x: 1, y: 2 被推斷具有 Point 類型結構。
  //const point_2 = { c:9,x: "1", y: 2 ,s:4 }; // 跳錯 Type 'string' is not assignable to type 'number'
  point_1 = point_2; 
  
  type PointType = { x: number; y: number };
  let typePoint_1: PointType = { x: 1, y: 2 }; // 正確，符合 PointType 結構
  let typePoint_2 = { x: 1, y: 2 }; 
  
  // type 可以處理聯合類型或字面量類型(Literal Types)（interface 無法做到）
  type Status = "success" | "error";  // 字面量類型
  type Response = { status: Status; message: string };
  const successResponse: Response = { status: "success", message: "Operation succeeded" };
  // interface 無
}
