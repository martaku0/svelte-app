<script>
  // @ts-ignore
  import { Router, Link, Route } from "svelte-routing";
</script>

<header class="text-gray-600 body-font">
  <div
    class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
  >
    <a
      href="/"
      class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span class="ml-3 text-xl">Tailblocks</span>
    </a>
    <nav
      class="md:ml-auto flex flex-wrap items-center text-base justify-center"
    >
      <Link to="/" class="mr-5 hover:text-gray-900">Home</Link>
      <Link to="about" class="mr-5 hover:text-gray-900">About</Link>
      <Link to="blog" class="mr-5 hover:text-gray-900">Blog</Link>
      <Link to="board" class="mr-5 hover:text-gray-900">Board</Link>
      <Link to="await" class="mr-5 hover:text-gray-900">Await</Link>
      <Link to="poke" class="mr-5 hover:text-gray-900">Poke</Link>
      <Link to="quiz" class="mr-5 hover:text-gray-900">Quiz</Link>
      <Link to="crossword" class="mr-5 hover:text-gray-900">Crossword</Link>
      <Link to="sudoku" class="mr-5 hover:text-gray-900">Sudoku</Link>
    </nav>
    <button
      class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
      >Button
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        class="w-4 h-4 ml-1"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</header>

<style media="print">
  @media print{
        *{
            display: none;
        }
    }
</style>