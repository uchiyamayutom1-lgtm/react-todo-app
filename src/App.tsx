// React から useState フックをインポート
import { useState } from 'react';

type Todo = {
  value: string;
};

export const App = () => {
  
  // 初期値: 空文字列 ''
  const [text, setText] = useState('');
  const [todos,setTodos] = useState<Todo[]>([]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
   };

  // todos ステートを更新する関数
  const handleSubmit = () => {
    // 何も入力されていなかったらリターン
    if (!text) return;

    // 新しい Todo を作成
    // 明示的に型注釈を付けてオブジェクトの型を限定する
    const newTodo: Todo = {
      // text ステートの値を value プロパティへ
      value: text,
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
    </div>
  );
};