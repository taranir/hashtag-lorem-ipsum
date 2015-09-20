a = document.getElementsByClassName("green");
b = a.map(function(item) {
  return item.innerHTML.slice(1);
})
b.join("\n");
