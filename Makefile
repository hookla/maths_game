# Makefile for 11+ Maths Quest static site
#
# Usage:
#   make serve         Start a local HTTP server at http://localhost:$(PORT)
#   make open          Open the site in the default browser
#   make PORT=<port>   Specify a custom port (default: 8000)

# Default port for local server (override with make PORT=...)
PORT ?= 8000

.PHONY: help serve open extract lint

help:
	@echo "Usage:"
	@echo "  make serve         Start a local HTTP server at http://localhost:$(PORT)"
	@echo "  make open          Open the site in the default browser"
	@echo "  make PORT=<port>   Specify a custom port (default: $(PORT))"
	@echo "  make extract       Combine all generator code into GENERATORS.md"
	@echo "  make lint          Run ESLint to statically check JS modules"

serve:
	@echo "Serving 11+ Maths Quest at http://localhost:$(PORT) (no cache)"
	@PORT=$(PORT) python3 serve.py

open:
	@echo "Opening http://localhost:$(PORT) in your browser..."
	@if which xdg-open >/dev/null 2>&1; then \
		xdg-open http://localhost:$(PORT); \
	elif which open >/dev/null 2>&1; then \
		open http://localhost:$(PORT); \
	else \
		echo "Please open http://localhost:$(PORT) in your browser"; \
	fi

extract:
	@echo "Extracting generator modules to GENERATORS.md"
	@bash extract_generators.sh
 
lint:
	@if [ ! -d node_modules ]; then \
	    echo "Error: dependencies not installed. Run 'npm install' first."; \
	    exit 1; \
	fi
	@echo "Running ESLint across JS files..."
	@npm run lint