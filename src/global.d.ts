import algoliasearch from "algoliasearch/lite";
import instantsearch from "instantsearch.js/dist/instantsearch.production.min";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

declare global {
  interface Window {
    algoliasearch: typeof algoliasearch;
    instantsearch: typeof instantsearch;
    adapter: typeof TypesenseInstantsearchAdapter;
  }
}

window.adapter = TypesenseInstantsearchAdapter;
