# Tic Tac Toe AI : Frontend

This is a web app served with node.js/express that allows users to play Tic-Tac-Toe against an AI as well as receive suggestions as to where to go next.

The site queries [the backend](https://github.com/jamiejamiebobamie/tictactoe_backend), a public API that can be accessed by anyone. The API when returns a new board state with the suggested move and the winner (if there is one) in the form of JSON.

An example query to the API would be: https://play-tictactoe-ai.herokuapp.com/api/v1/turn/o/board/xox!o!!x!

The public API serves up moves based on [a model](https://github.com/jamiejamiebobamie/tictactoe_ai) that has been trained with reinforcement learning.
The web app allows the user to scale down the A.I.'s difficulty with a slider.
To allow for a scaling difficulty, the API also serves up random moves.

An example query to receive a random move would be: https://play-tictactoe-ai.herokuapp.com/api/v1/rand/turn/o/board/xox!o!!x!

To make the website appealing on a variety of screen sizes, I used p5.js with custom UI elements that could be nested within one another.

## [Live Site](https://tictactoe-play.herokuapp.com)
Please visit [the live site](https://tictactoe-play.herokuapp.com).

## Authors

* **Jamie McCrory**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
