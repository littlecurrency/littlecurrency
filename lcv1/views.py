import yfinance as yf
from django.shortcuts import render

def fetch_stock_data(stock_symbol):
    try:
        stock_data = yf.Ticker(stock_symbol)
        return stock_data.info
    except Exception as e:
        print(f"An error occurred while fetching data: {e}")
        return None


def search_page(request):
    if request.method == 'GET':
        search_query = request.GET.get('search_query', '')
        ns_stock_data = None
        bo_stock_data = None

        if search_query:
            ns_stock_data = fetch_stock_data(search_query + '.ns')
            bo_stock_data = fetch_stock_data(search_query + '.bo')

        # Fetch current values for Nifty 50, Sensex, and Bank Nifty
        nifty_ticker = "^NSEI"
        sensex_ticker = "^BSESN"
        banknifty_ticker = "^NSEBANK"

        tickers = [nifty_ticker, sensex_ticker, banknifty_ticker]
        data = yf.download(tickers, period="1d")

        current_nifty_value = data["Close"][nifty_ticker][-1]
        current_sensex_value = data["Close"][sensex_ticker][-1]
        current_banknifty_value = data["Close"][banknifty_ticker][-1]

        context = {
            'ns_stock_data': ns_stock_data,
            'bo_stock_data': bo_stock_data,
            'search_query': search_query,
            'current_nifty_value': current_nifty_value,
            'current_sensex_value': current_sensex_value,
            'current_banknifty_value': current_banknifty_value,
        }
        return render(request, 'search.html', context)

    return render(request, 'search.html')

