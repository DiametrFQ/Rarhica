import components from "./components/main.js";

console.log({
  ...components,
});

$("document").ready(() => {
  console.log({
    ...components,
  });
});
