// React から useState フックをインポート
import { useState } from 'react';

export const App = () => {
  // 初期値: 空文字列 ''
  const [text, setText] = useState('');

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          // text ステートが持っている入力中テキストの値を value として表示
          value={text}
          // onChange イベント（＝入力テキストの変化）を text ステートに反映する
          onChange={(e) => setText(e.target.value)}
        />
        <input type="submit" />  {/* ← 省略 */}
      </form>

      {/* ↓ DOM のリアクティブな反応を見るためのサンプル */}
      <p>{text}</p>
      {/* ↑ あとで削除 */}
    </div>
  );
};