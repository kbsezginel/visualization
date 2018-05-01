Matplotlib Code snippets
=========================

Subplot
--------
An subplot example where the data is arranged as a list of dictionaries.
Each element of the list is a dictionary where 'x' and 'y' keys are used to plot the data.

```python
import numpy as np


plot_data = [{'x': [0, 1, 2, 3], 'y': [10, 14, 20, 35]},
             {'x': np.arange(10), 'y': np.random(10)}]
```

```python
def subplot(plot_data, ncol=1, width=3, height=3, dpi=200, save=None):
    n_plots = len(plot_data)
    figsize = (n_plots / ncol * width, ncol * height)
    fig = plt.figure(figsize=figsize, dpi=dpi)
    fig.subplots_adjust(hspace=.5, wspace=.25)
    for idx, data in enumerate(plot_data, start=1):
        ax = fig.add_subplot(1, n_plots, idx)
        ax.plot(data['x'], data['y'])
    if save is not None:
        plt.savefig(save, dpi=dpi, transparent=True, bbox_inches='tight')
```
