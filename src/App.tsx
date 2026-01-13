// React から useState フックをインポート
import { useState } from 'react';

//型指定関数を定義
type Todo = {
  value: string;
  readonly id: number;
  checked:boolean;
  removed: boolean;
};

export const App = () => {
  
  // 初期値: 空文字列 ''
  const [text, setText] = useState('');
  const [todos,setTodos] = useState<Todo[]>([]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
   };

  // todos ステートを更新する関数定義
  const handleSubmit = () => {
    // 何も入力されていなかったらリターン
    if (!text) return;

    // 新しい Todo を作成
    // 明示的に型注釈を付けてオブジェクトの型を限定する
    const newTodo: Todo = {
      // text ステートの値を value プロパティへ
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };
    /**
     * 更新前の todos ステートを元に
     * スプレッド構文で展開した要素へ
     * newTodo を加えた新しい配列でステートを更新
     **/
    setTodos((todos) => [newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText('');
  };

    //チェックボックスを更新する関数定義
    const handleCheck = (id: number, checked: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked };
        }
        return todo;
      });

      return newTodos;
    });
  }
    //removeを更新する関数を定義
    const handleRemove = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed };
        }
        return todo;
      });

      return newTodos;
    });
  };
  
  

  /*todo編集時の関数*/ 
    const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      /**
       * 引数として渡された todo の id が一致する
       * 更新前の todos ステート内の todo の
       * value プロパティを引数 value (= e.target.value) に書き換える
       */
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return{...todo, value};
        }
         return todo;
      });

      // todos ステート配列をチェック（あとでコメントアウト）
      console.log('=== Original todos ===');
      todos.map((todo) => {
        console.log(`id: ${todo.id}, value: ${todo.value}`);
      });
      // ここまで

      // todos ステートを更新
      return newTodos;
    });
  };

  

  return (
    
    <div>
      <form
       onSubmit={(e) =>{ 
        e.preventDefault();
        handleSubmit();
      }}
    >
        <input
          type="text"
          // text ステートが持っている入力中テキストの値を value として表示
          value={text}
          // onChange イベント（＝入力テキストの変化）を text ステートに反映する
          onChange={(e) => handleChange(e)}
        />
        <input type="submit" value='追加'　onSubmit={handleSubmit}  />  {/* ← 省略 */}
      </form>

      <ul>
        {todos.map((todo) => {
          return(
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.checked}
              //呼び出し側でchecked反転
              onChange={() => handleCheck(todo.id, !todo.checked)}
              />
            <input 
            type="text" 
            disabled={todo.checked}
            value={todo.value}
            onChange={(e) => handleEdit(todo.id, e.target.value)}
            />
            <button  onClick={() => console.log('removed!')}>
              {todo.removed ? '復元':'削除'}
            </button>
            </li>
            );
        })}
      </ul>
    </div>
  );
};