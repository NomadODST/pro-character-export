window.splitIntoPages = function splitIntoPages(list, pageSize) {

  const pages = [];

  for (let i = 0; i < list.length; i += pageSize) {

    pages.push(list.slice(i, i + pageSize));

  }

  return pages;

}
