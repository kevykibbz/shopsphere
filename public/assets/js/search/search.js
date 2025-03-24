document.addEventListener("DOMContentLoaded", function () {
  const searchInputs = [
    {
      input: document.getElementById("q"),
      wrapper: document.querySelector(".header-search-wrapper"),
    },
    {
      input: document.getElementById("mobile-search"),
      wrapper: document.querySelector(".mobile-search"),
    },
  ];

  function setupSearch(inputElement, wrapperElement) {
    let suggestionsContainer = null;
    let loadingIndicator = null;

    function createSuggestionsContainer() {
      if (!suggestionsContainer) {
        suggestionsContainer = document.createElement("div");
        suggestionsContainer.className = "search-suggestions";
        wrapperElement.appendChild(suggestionsContainer);

        loadingIndicator = document.createElement("div");
        loadingIndicator.className = "search-loading";
        loadingIndicator.innerHTML = `<span><i class="icon-search"></i> Loading...</span>`;
        suggestionsContainer.appendChild(loadingIndicator);
        loadingIndicator.style.display = "none";
      }
    }

    function removeSuggestionsContainer() {
      if (suggestionsContainer) {
        suggestionsContainer.remove();
        suggestionsContainer = null;
      }
    }

    async function fetchSearchResults(query) {
      if (query.length < 2) {
        removeSuggestionsContainer();
        return;
      }

      createSuggestionsContainer();
      loadingIndicator.style.display = "block";

      try {
        const response = await fetch(`/api/search?q=${query}`);
        const results = await response.json();

        loadingIndicator.style.display = "none";

        suggestionsContainer.innerHTML = results.length
          ? results
              .map(
                (product) =>
                  `<div class="suggestion-item">
                                    <a href="/product/${
                                      product._id
                                    }" class="suggestion-link">
                                        <img src="${
                                          product.images?.[0] ||
                                          "/assets/images/default.jpg"
                                        }" 
                                             alt="${product.name}" 
                                             class="suggestion-img">
                                        <span class="suggestion-name">${
                                          product.name
                                        }</span>
                                    </a>
                                </div>`
              )
              .join("")
          : `<div class="suggestion-item no-results">No results found</div>`;
      } catch (error) {
        console.error("Error fetching search results:", error);
        suggestionsContainer.innerHTML =
          '<div class="suggestion-item error">Error loading results</div>';
      }
    }

    inputElement.addEventListener("input", function () {
      if (this.value.trim() === "") {
        removeSuggestionsContainer();
      } else {
        fetchSearchResults(this.value);
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrapperElement.contains(e.target)) {
        removeSuggestionsContainer();
      }
    });
  }

  searchInputs.forEach(({ input, wrapper }) => {
    if (input && wrapper) {
      setupSearch(input, wrapper);
    }
  });
});
