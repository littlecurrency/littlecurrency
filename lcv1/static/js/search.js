document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const suggestionsDiv = document.getElementById("suggestions");
    let selectedSuggestionIndex = -1; // To keep track of selected suggestion

    searchInput.addEventListener("input", function() {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsDiv.innerHTML = ""; // Clear previous suggestions

        if (query.length === 0) {
            return;
        }

        fetch(stockListJSONURL)
            .then(response => response.json())
            .then(data => {
                const suggestions = Object.keys(data)
                    .filter(company => company.toLowerCase().includes(query))
                    .slice(0, 5); // Limit the number of suggestions to show

                suggestions.forEach((company, index) => {
                    const suggestionElement = document.createElement("div");
                    suggestionElement.classList.add("suggestion-row"); // Add the class for styling
                    suggestionElement.textContent = company;
                    suggestionElement.dataset.code = data[company].code; // Store stock code as data attribute
                    suggestionElement.addEventListener("click", function() {
                        const stockCode = data[company].code; // Extract stock code
                        searchInput.value = stockCode; // Update the input with the stock code
                        suggestionsDiv.innerHTML = ""; // Clear suggestions after selection
                        // Rest of your code...
                    });

                    suggestionsDiv.appendChild(suggestionElement);
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    });

    // Keyboard navigation
    searchInput.addEventListener("keydown", function(event) {
        const suggestions = suggestionsDiv.querySelectorAll(".suggestion-row");

        if (event.key === "ArrowDown") {
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
            updateSelectedSuggestion(suggestions);
        } else if (event.key === "ArrowUp") {
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSelectedSuggestion(suggestions);
        } else if (event.key === "Enter") {
            if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
                const selectedSuggestion = suggestions[selectedSuggestionIndex];
                const stockCode = selectedSuggestion.dataset.code;
                searchInput.value = stockCode;
                suggestionsDiv.innerHTML = "";
            }
        }
    });

    function updateSelectedSuggestion(suggestions) {
        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle("selected", index === selectedSuggestionIndex);
        });
    }
});
