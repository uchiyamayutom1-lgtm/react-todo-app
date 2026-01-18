// React から useState フックをインポート
// localforage をインポート
import localforage from 'localforage';

// useEffect フックをインポート
import { useEffect, useState  } from 'react';

//型指定関数を定義


export const App = () => {
  
  // 初期値: 空文字列 ''
  const [text, setText] = useState('');
  const [todos,setTodos] = useState<Todo[]>([]);
  const[filter, setFilter] = useState<Filter>('all');

  const handleFilter = (filter:Filter) => {
    setFilter(filter);
  }

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
    const filteredTodos = todos.filter((todo) => {
    // filter ステートの値に応じて異なる内容の配列を返す
    switch (filter) {
      case 'all':
        // 削除されていないもの
        return !todo.removed;
      case 'checked':
        // 完了済 **かつ** 削除されていないもの
        return todo.checked && !todo.removed;
      case 'unchecked':
        // 未完了 **かつ** 削除されていないもの
        return !todo.checked && !todo.removed;
      case 'removed':
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

    //チェックボックスを更新する関数定義
    
   
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
    };
  
  

  /*todo編集時の関数*/ 
    const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });

      return newTodos;
    });
  };
  
   
    /*localに保存
     
   * キー名 'todo-20200101' のデータを取得
   * 第 2 引数の配列が空なのでコンポーネントのマウント時のみに実行される
  */
  useEffect(() => {
    localforage
      .getItem('todo-shelve')
      .then((values) => setTodos(values as Todo[]));
  }, []);

  /**
   * todos ステートが更新されたら、その値を保存
  */
  useEffect(() => {
    localforage.setItem('todo-shelve', todos);
  }, [todos]);

  return (
    
    <div>
      <select defaultValue="all" onChange={(e) => handleFilter(e.target.value as Filter)}>
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>

{/* --- 条件分岐のエリア --- */}
      {filter === 'removed' ? (
      <button 
      onClick={handleEmpty}
      disabled={todos.filter((todo) => todo.removed).length === 0}
      >
        ごみ箱を空にする

      </button>
    ) : (
      // フィルターが `checked` でなければ Todo 入力フォームを表示
      filter !== 'checked' && (
    
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
        <input
         type="submit"
          value='追加'
          onSubmit={handleSubmit}  
          />  
      </form>
      )
    )}
    {/* --- 条件分岐のエリア終了 --- */}
      <ul>
        {filteredTodos.map((todo) => {
          return(
          <li key={todo.id}>
            <input
              type="checkbox"
              disabled={todo.removed}
              checked={todo.checked}
              //呼び出し側でchecked反転
              onChange={() => handleTodo(todo.id, 'checked',!todo.checked)}
              />
            <input 
            type="text" 
            disabled={todo.checked||todo.removed}
            value={todo.value}
            onChange={(e) => handleTodo(todo.id,'value', e.target.value)}
            />
            <button  onClick={() => handleTodo(todo.id,'removed', !todo.removed)}>
              {todo.removed ? '復元':'削除'}
            </button>
            </li>
            );
        })}
      </ul>
    </div>
  );
};