Matplotlib Code snippets
=========================

Subplot
--------
A subplot example where a list of data is and a plot function is used to generate a grid of plots.
The subplot function is used to arrange the grid. As input it takes the list of data to be plotted,
the function that will be used to plot each data, additional arguments for that function and
keyword arguments for the subplot function itself.

This structure allows you to use the same subplot function to plot any kind of data.
You can just change the functionthat you use to plot your data without changing the subplot function itself.

```python
import matplotlib.pyplot as plt
import numpy as np


def subplot(plot_fun, plot_data, plot_args={}, nrow=1, width=3, height=3, dpi=200, save=None, title=None):
    n_plots = len(plot_data)
    ncol = np.ceil(n_plots / nrow)
    figsize = (ncol * width, nrow * height)
    fig = plt.figure(figsize=figsize, dpi=dpi)
    fig.subplots_adjust(hspace=.5, wspace=.25)
    for idx, data in enumerate(plot_data, start=1):
        plot_args['ax'] = fig.add_subplot(nrow, ncol, idx)
        plot_fun(data, **plot_args)
        if title is not None:
            plt.title(title[idx - 1])
    if save is not None:
        plt.savefig(save, dpi=dpi, transparent=True, bbox_inches='tight')
```

Here the `plot_fun` is your function that will be used to plot your data, `plot_data` is a list of data
that will be fed to your plot function and `plot_args` is a dictionary to be used as kwargs for your plot function.
Here is an example for a scatter plot:

```python
def scatter_plot(data, ax, markersize=100):
    ax.scatter(data['x'], data['y'], markersize=markersize)
```

Here our `scatter_plot` function takes a dictionary with `x` and `y` keys as input data, the axis object from
the subplot function and a `markersize` kwarg to set marker size.
Here is an example for using these functions together:

```python
plot_data = [dict(x=np.arange(10), y=np.random.random_sample(10)),
             dict(x=np.arange(20), y=np.random.random_sample(20))]
             
subplot(scatter_plot, plot_data, dict(markersize=50))
```

Subplot function arguments:
- nrow (int): Number of rows
- width (float): The width of each plot in the subplot
- height (float): The height of each plot in the subpot
- dpi (int): Plot resolution (dots per inch)
- title (list): List of titles for each plot in the subplot 
