
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter"

const { instantsearch } = window;


const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "q7GcadhySewfM72Jwdhljp7wMA28KDBo", // Be sure to use the search-only-api-key
    nodes: [
      {
        host: "typesense-dev.intertop.com",
        port: 443,
        protocol: "https"
      }
    ]
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    query_by: "name",
    facet_by: "facetSize.value,facetClothingSize.value,facetColor.value,facetBrand.value,facetCountry.value,salePrice",
    sort_by: "popularity:desc"
  }
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
  searchClient,
  indexName: "dev_product_s1_ua",
  future: { preserveSharedStateOnUnmount: true }
});

// Format Price Function
const formatPrice = (price, currency) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency }).format(price);
};


// Define Hits Template
const hitTemplate = (hit) => {
  return `

<article class="hit">
    <header class="image-container">
        <img src="https://cdn.intertop.com${hit.origin.MAIN_PICTURE}" alt="" class="image" title="${hit.name}" />
    </header>
    <div class="info-container">
        <div class="name">
            ${instantsearch.highlight({attribute: 'name', hit})}
        </div>

        <div class="price">Цена: ${formatPrice(hit.origin.MAXIMUM_PRICE, 'UAH')}</div>
        <div class="sale">Со скидкой: ${formatPrice(hit.origin.MINIMUM_PRICE, 'UAH')} </div>
    </div>
</article>

    `;
};

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: hitTemplate
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8
  }),
  instantsearch.widgets.stats({
    container: "#stats",
  }),
  instantsearch.widgets.currentRefinements({
    container: '#state'
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  instantsearch.widgets.refinementList({
    container: '#size-filter',
    attribute: 'facetSize.value',
    searchable: true,
    sortBy: ['count:desc', 'name:asc'],
    templates: {
      header: 'Size',
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#clothing-size-filter',
    attribute: 'facetClothingSize.value',
    searchable: true,
    sortBy: ['count:desc', 'name:asc'],
    templates: {
      header: 'Clothing Size',
    },
  }),

  instantsearch.widgets.refinementList({
    container: '#brand-filter',
    attribute: 'facetBrand.value',
    searchable: true,
    sortBy: ['count:desc', 'name:asc'],
    templates: {
      header: 'Brand',
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#color-filter',
    attribute: 'facetColor.value',
    searchable: true,
    sortBy: ['count:desc'],
    templates: {
      header: 'Color',
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#country-filter',
    attribute: 'facetCountry.value',
    searchable: true,
    sortBy: ['name:asc'],
    templates: {
      header: '<div class="filter-title">Country</div>',
    },
  }),
  instantsearch.widgets.rangeSlider({
    container: '#price-range-filter',
    attribute: 'salePrice',
    templates: {
      header: 'Price Range',
    },
    tooltips: {
      format: (rawValue) => formatPrice(rawValue,'UAH'),
    },
  }),

]);


search.start();

