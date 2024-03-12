## Features:

- numbered list with history of all moves, updated as the game progresses

## Setup

- start with an empty square X button
- `styles.css` defines the styles for your React app
- first two CSS selectors `*` and `body` define the style of large parts of your app
- the `.square` selector defines the style of any componentwhere the `className` property is set to `square`
- would match the button from your Square component
- setup `index.js`

  - a bridge between the component you created in the `App.js` file and the web browser
  - brings together: React, ReactDOM (React's library to talk to web browsers), the styles for your components, the component you created in `App.js`
  - the remainder brings all the pieces together and injects the product into `index.html` (in the `public` folder)

## Building the Board

- copy/paste 9 squares into an empty fragment
  - React components need to return a **single JSX element**, and not multiple JSX elements like 2 buttons
  - use fragments `<>` or empty ``<div>``
- group squares into rows with `div`s and CSS classes
  - give each square a number
- the CSS defined in `styles.css` styles the divs with the `className` of `board-row`
- rename the `Square()` component to `Board()`

### Passing Data through Props

- want to change the value of a square

  - from empty to "X" when the user clicks on the square
  - instead of copy/pasting code that updates a square nine separate times
- React's component architecture allows you to create a reusable component to avoid messy, duplicated code

  - extract the first line defining your first square from your `Board` into a new `Square` component
  - then update the Board component to render that `Square` using JSX syntax
- use props to pass the value each square should have

  - from the `Board` to its child `Square`
- update the `Square` component to read the `value` prop passed from the parent `Board`
- add the `value` prop to each `Square` component rendered by the `Board` component

## Making an Interactive Component

- we want to fill the `Square` component with an `X` when user clicks it
- declare a function called `handleClick` inside of `Square`
- then add `onClick=` to the props of the button JSX element returned from the `Square`
- use state to "remember" information about a component

  - store the current value of `Square` in state
    - and change it when the `Square` is clicked
  - import `useState` at the top of the file
- remove the `value` prop from the `Square` component

  - instead, add a new line at the start of `Square` that calls `useState`
  - return a state variable called `value` and a state setter function called `setValue`
  - pass `null` as the initial value to `useState`

    - so here, `value` starts off equal to `null`
- since the `Square` component no longer accepts props

  - remove the `value` prop from all nine of the Square components created by the `Board` component
  - change `Square` to display an
- now change `Square` to display an "X" when clicked
- replace the `console.log('clicked!');` event handler with `setValue('X')`

  - by calling this `set` function from an `onClick` handler
  - telling React to re-render that `Square` whenever its button is clicked
  - after the update, the `Square`'s `value` will be `'X'`
    - so you'll see the "X" on the game board
- each Square has **it's own state**, the `value` stored in each Square is completely independent of the others
- when you call a `set` function in a component, React automatically updates the child components inside too

### React Developer Tools

- let you check the props and the state of your React components
- available as a Chrome, Firefox, and Edge browser extension

## Completing the Game

- now need to alternate placing "X"s and "O"s on the board
- and need a way to determine a winner

### Lifting State Up

- currently, each `Square` component maintains a part of the game's state
- to check for a winner in a game, the `Board` would need to know the state of each of the 9 `Square` components
- one approach: have the `Board` "ask" each `Square` for that `Square`'s state

  - technically possible, but discouraged
  - dificult to understand, suceptible to bugs, and hard to refactor
- best approach: store the game's state in the parent `Board` component

  - instead of in each `Square`
  - the `Board` component can tell each `Square` what to display
    - by passing a prop
    - like earlier when we passed a number to each `Square`
- lifting state - when you declare the **shared state in the parent** component with **multiple child components sharing the state**

  - the parent can **pass that state back down** to the children **via props**
  - keeps the child components in sync with each other and with their parent
  - common to lift state into a parent when React components are refactored
- edit the `Board` component so that it declares a **state variable** named `square` that defaults to an array of 9 nulls corresponding to the 9 squares

  - `const [squares, setSquares] = useState(Array(9).fill(null));`
  - creates an array with nine elements, and sets each of them to `null`
  - the `useState()` call around it declares a `squares` state variable
    - that's initially set to the created array
    - each entry corresponds to the value of a square
  - when you fill in the board later, the `squares` array will look like:
    - `['O', null, 'X', 'X', 'X', 'O', 'O', null, null]`
- now your `Board` component needs to pass the `value` prop down to each `Square` that it renders, like:

  - `<Square value={squares[0]}>`
  - `<Square value={squares[1]}>`, etc.
- next, edit the `Square` component

  - to receive the `value` prop from the Board component
  - this will require **removing**

    - the `Square` component's own stateful tracking of `value`
    - and the button's `onClick` prop

```jsx
function Square({ value }) {
	return <button className="square">{value}</button>;
}
```

- each square will now receive a `value` prop that will either be 'X', 'O', or null(empty squares)
- next, you need to change what happens when a `Square` is clicked
  - the `Board` component now maintains *which squares are filled*
  - need to create a way for the `Square` to update the `Board`'s state
- since **state is private to a component that defines it**
  - you cannot update the `Board`'s state *directly from `Square`*
  - instead, **pass down a function** from the `Board` component to the `Square`
    - you'll have `Square` call that function *when a square is clicked*
  - define a `onSquareClick` function that the `Square` component will call when it is clicked
- add the `onSquareClick` function to the `Square` component's props:

```jsx
function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}
```

- now conect the `onSquareClick` **prop** to a `handleClick` **function** on the `Board`
  - **pass the function** to the `onSquareClick` prop of the first `Square` component
- define the `handleClick(i)` function inside the `Board` component
  - this function will update the `squares` array holding the Board's state
  - creates a copy of the `squares` array named `nextSquares`
    - with the JavaScript `slice()` Array method
  - then updates the `nextSquares` array
    - to add "X" to the first square (index `[0]`)
- calling the `setSquares` function lets React know the **state of the component has changed**
  - triggers a re-render of the components that use the `squares` state
  - i.e., the `Board` component AND its child components (the `Square` components that make up the board)

```js
export default function Board() {
    const [squares, setSquares] = useState(Array(9).fill(null));

    function handleClick() {
        const nextSquares = squares.slice();
	nextSquares[0] = "X";
	setSquares(nextSquares);
    }

    return (
        <>
	    <div className="board-row">
	        <Square value={squares[0]} onSquareClick={handleClick} />
                <Square value={squares[1]} onSquareClick={handleClick} />
		// ...
	</>
    );
}
```

### Note: Closures in JavaScript

- JavaScript supports **closures**:

  - an inner function (e.g., `handleClick`) has access to **variables** and **functions** defined in a outer function (e.g., `Board`)
- this means that the `handleClick` function can

  - **read** the `squares` state AND **call** the `setSquares` method because they are both defined inside of the `Board` function
  - now you can add X's to the board, but only to the upper left square
  - at this point, the `handleClick` function is hardcoded to update the index for the upper left square (`squares[0]`)

### Update `handleClick` to be able to update any square

- add an argument `i` to the `handleClick` function

  - (the **index of the square** to update)
  - then pass that `i` to `handleClick`
- **DO NOT** set the `onSquareClick` prop of `Square` to be `handleClick(0)` **directly in the JSX** like:

  - `<Square value={squares[0]} onSquareClick={handleClick(0)}>`
  - the `handleClick(0)` call will be a part of rendering the Board component

    - it alters the state of the board component by calling `setSquares`
    - your entire Board component will be re-rendered again
    - but this runs `handleClick(0)` *again*, leading to an infinite loop
  - error: `Too many re-renders. React limits the number of renders to prevent an infinite loop.`

    - this didn't happen earlier when we were **passing** the `handleClick` function **as a prop** `onSquareClick={handleClick}` (not calling it)
    - passing the **call** `handleClick(0)` calls that function *right away*
      - notice the parentheses, that's why it **runs** too early
    - you don't want to call `handleClick` UNTIL the user clicks!
- one verbose fix:

  - create separate functions for each square and pass (rather than call) each functions down **as prop values** to their associated squares

    - `handleFirstSquareClick` that calls `handleClick(0)`
      - passed as prop to the first square like `onSquareClick={handleFirstSquareClick}`
    - `handleSecondSquareClick` that calls `handleClick(1)`
      - passed as prop to the second square like `onSquareClick={handleSecondSquareClick}`
    - and so on
  - this would solve the infinite loop, but defining nine functions and giving each of them a name is too verbose

### BETTER WAY: pass an **arrow function as a** value to the `onSquareClick` prop

- shorter syntax for defining functions

  - when the square is clicked, the code after the `=>` arrow will run
  - calling `handleClick(0)`
- update the other eight squares to call `handleClick` from the arrow functions you pass
- make sure that the argument for each call of the `handleClick` **corresponds to the index** of the correct square
- now you can add X's to any square on the board by clicking on them
- all the state management is handled by the `Board` component

  - the parent `Board` passes props to the child `Square` components
  - when clicking on a `Square`
    - the child `Square` component now **asks the parent** `Board` component to update the state of the `Board`
  - when the `Board`'s state changes,
    - **BOTH the parent** `Board` component **AND every child** `Square` re-renders automatically
- keeping the state of all the squares in the `Board` component will allow it to determine the winner in the future

```jsx
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0] onSquareClick={() => handleClick(0)} />
        <Square value={squares[1] onSquareClick={() => handleClick(1)} />
        <Square value={squares[2] onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3] onSquareClick={() => handleClick(3)} />
        <Square value={squares[4] onSquareClick={() => handleClick(4)} />
        <Square value={squares[5] onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6] onSquareClick={() => handleClick(6)} />
        <Square value={squares[7] onSquareClick={() => handleClick(7)} />
        <Square value={squares[8] onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );

```

### Recap: when user clicks top-left square to add 'X'

##### 1. Clicking on the upper left square:

* **runs the function** that the `button` received
  * as its `onClick=` prop from the `Square`
* the `Square` **received *that same* function**
  * as its `onSquareClick=` prop from the `Board`
* the `Board` component ***defined* that function directly in JSX**

##### 2. The `handleClick` function:

- uses the argument (`0`) to update
- the first element of the `squares` array from `null` to `X`

##### 3. The `squares` state of the `Board` component was updated

- so the `Board` and all of its children re-render
- this causes the `value` prop of the `Square` component
  - with index 0 to change from `null` to `X`
- user sees the upper left square has changed from empty to having an X after clicking it

#### Note: the DOM ``<button>``'s `onClick` attribute

- built-in HTML component attribute names have special meaning in React
- naming for custom components is up to programmer
  - could give any name to
    - the `Square`'s `onSquareClick` prop
    - the `Board`'s `handleClick` function
- conventional in React to
  - use `onSomething` names for **props** which represent events
  - use `handleSomething` for the **function** definitions which handle those events

### Immutability

- two approaches to **changing** data:
  - **mutate** the data by directly changing the data's values
    - like `squares[0] = 'X'`
  - **replace** the data with a new copy which has the desired changes
    - like `const nextSquares = ['X', null, null, null...]`
- benefits of NOT mutating the original data
  - makes complex features easier to implement
    - e.g., undo/redo actions is a common requirement for apps
    - avoiding direct data manipulation lets you **keep previous versions** of the data intact, and **reuse** them later
  - by default, **all child components** **re-render automatically** when the **state of the parent** changes
    - includes even the children that weren't affected by the change
    - although re-rendering itself is not noticeable to the user
      - you may want to skip re-rendering a part of the tree
      - that clearly wasn't affected, for performance reasons
    - immutability makes it very cheap for components to compare whether their data has changed or not
    - learn more about how React chooses when to re-render a component in the `memo` API reference

### Taking Turns

- set the first move to be "X" by default
  - keep track of this by adding another piece of state to the board component `const [xIsNext, setXIsNext] = useState(true);`
- each time a player moves
  - `xIsNext` (a boolean) will be **flipped** to determine which player goes next
  - and the game's `squares` **state will be saved**
- update the `Board`'s `handleClick` function to
  - flip the value of `xIsNext`
  - also first check to see if square already has X or O value
    - if the square is filled, return in the `handleClick` function early
    - before it tries to update the board state
- now you can only add X's or O's to empty squares

```jsx
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0] onSquareClick={() => handleClick(0)} />
        <Square value={squares[1] onSquareClick={() => handleClick(1)} />
        <Square value={squares[2] onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[0] onSquareClick={() => handleClick(0)} />
        <Square value={squares[1] onSquareClick={() => handleClick(1)} />
        <Square value={squares[2] onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[0] onSquareClick={() => handleClick(0)} />
        <Square value={squares[1] onSquareClick={() => handleClick(1)} />
        <Square value={squares[2] onSquareClick={() => handleClick(2)} />
      </div>
    </>
  );
}
```

### Declaring a Winner

- need to show when the game is won and there are no more turns to take
- add a helper function called `calculateWinner`
  - takes an array of 9 squares
  - checks for a winner (checks for possible winning combinations)
  - returns `'X'`, `'O'`, or `null` as appropriate
- note: it doesn't matter whether you define `calculateWinner` before or after the `Board`, we've put it at the end so you don't have to scroll past it every time you edit your components

#### Define a `calculateWinner()` helper function

```jsx
export default function Board() {
  // ...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

#### Call `calculateWinner(squares)` in the `Board`'s `handleClick` function

- you can perform this check at the same time you check if a user has clicked a square that already has a X or O (return early in both cases)

```jsx
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  // ...
}
```

#### Add a `status` section to the `Board`

- the status will display the winner if the game is over
  - or display which player's turn is next if the game is ongoing

```jsx
export default function Board() {
  // ...
  const winner = calculateWinner(squares);  // helper function 
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

## Adding Time Travel

### Storing a History of Moves

- we used `slice()` to create a copy of the `squares` array after every move
  - treated it as immutable, allows you to store every past version of the array and navigate between the turns that have already happened
- store the past `squares` array in another array called `history`
  - store `history` as a new state variable array to represent ALL board states
  - from the first to the last move

#### Example: shape of `history` array in state

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Lifting State Up, Again

- now write a new top-level component called `Game` to display a list of past moves, and place the `history` state here
- placing the `history` state into the `Game` component
  - will let you remove the `squares` state **from its child** `Board` component

    - just like we "lifted state up" from the `Square` component into the `Board`
    - now lift it up from the `Board` into the top-level `Game` component
  - gives the `Game` component full control over the `Board`'s data

    - lets it instruct the `Board` to render previous turns from the `history`
- note: move `export default` keywords from the `Board` to the `Game` component
  - tells your index.js file to use this as the top-level component

#### Add `Game` component - renders the `Board` and some markup

- Add `history` state to the `Game` component to track which player is next and the history of moves
- `const [history, setHistory] = useState([Array(9).fill(null]);`

  - `[Array(9).fill(null)]` is an array with a single item
    - an array of 9 `null`s
- to render the squares for the current move, read the **last squares array** from the `history` state variable

  - don't need `useState` for this, enough info to calculate during rendering
  - `const currentSquares = history[history.length - 1];`
- create a `handlePlay` function inside the `Game` component

  - that will be called by the `Board` component to update the game
- pass `xIsNext`, `currentSquares`, and `handlePlay` as props to the `Board` component

  - like `<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />`
- Make the `Board` component fully controlled by the props it receives

  - change the `Board` component to take three props:

    - `xIsNext=` and `squares=`
    - and a new `onPlay`= function that `Board` can call with the updated squares array when a player makes a move
  - remove `xIsNext` and `squares` states from the `Board` component
  - in the `handleClick()` function on the `Board`

    - replace the `setSquares `and `setXIsNext` calls with a single call to your new `onPlay` function
    - so the `Game` component can update the `Board` when a user clicks a square
- implement the `handlePlay()` function in the `Game` component

  - Board used to call `setSquares` with an updated array
  - now it passes the updated `squares` array to `onPlay()`
  - `handlePlay()` needs to update `Game`'s state to trigger a re-render
    - but no longer has `setSquares` function to call
    - now using the `history` state variable to store this information
  - update `history` by appending the updated `squares` array as a new history entry like: `setHistory([...history, nextSquares]);`
    - creates a new array that contains all the items in `history` followed by `nextSquares`
    - read the `...history` spread syntax as "enumerate all the items in `history`"
  - also toggle `xIsNext` like `setXIsNext(!xIsNext);` (as Board used to do)
- at this point, we've moved the state to live in the `Game` component

  - the UI should be fully working as before the refactor

```jsx
import { useState } from 'react';

function Square({ value, onSquareClick }) {  // props passed from Board
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {  // props passed from Game
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // ...
}
```


## Showing the Past Moves

### Picking a Key

### Implementing Time Travel

## Final Cleanup

### Improvements

Thinking in React
