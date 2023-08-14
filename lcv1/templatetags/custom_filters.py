# custom_filters.py

from django import template

register = template.Library()

@register.filter
def human_readable_number(number):
    try:
        number = float(number)  # Convert the input to a float
    except ValueError:
        return number  # Return the original value if conversion fails

    if number >= 10000000:
        return f"{number / 10000000:.2f} Cr"
    elif number >= 100000:
        return f"{number / 100000:.2f} L"
    elif number >= 1000:
        return f"{number / 1000:.2f} K"
    else:
        return f"{number:.2f} "


