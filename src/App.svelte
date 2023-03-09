<script>
  import "./lib/Tailwind.css";

  // @ts-ignore
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Blog from "./routes/Blog.svelte";
  import Board from "./routes/Board.svelte";
  import Await from "./routes/Await.svelte";
  import Poke from "./routes/Poke.svelte";
  import Quiz from "./routes/Quiz.svelte";
  // @ts-ignore
  import Crossword from "./routes/Crossword.svelte";
  import Sudoku from "./routes/Sudoku.svelte";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Id from "./routes/pokemon/[id].svelte";

  export let url = "";
</script>

<Router {url}>
  <Header />
  <div>
    <Route path="blog" component={Blog} />
    <Route path="about" component={About} />
    <Route path="/"><Home /></Route>
    <Route path="board" component={Board} />
    <Route path="await" component={Await} />
    <Route path="poke" component={Poke} />
    <Route path="quiz" component={Quiz} />
    <Route path="crossword" component={Crossword} />
    <Route path="sudoku" component={Sudoku} />
    <Route path="pokemon/:id" component={Id} />
  </div>
</Router>
<Footer />
