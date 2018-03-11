SciVisComm Guest Lecture
========================

1. Create webpage using GitHub pages
------------------------------------
- Fork repo, rename
- Change content (config.yml and index.md)


2. Interactive plotting (bokeh)
-------------------------------
### Read data (csv)

```
import csv
rows = []
with open('dmog.csv') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        rows.append(row)
```

### Scatter plot

#### Arrange data
```
x_data = [i[1] for i in rows]
y_data = [i[3] for i in rows]
```

#### Plot figure
```
from bokeh.plotting import figure, show
from bokeh.plotting import output_notebook, output_file

p = figure(plot_width=1000, plot_height=600)

p.circle(x_data, y_data)
show(p)
output_notebook()
output_file(toolbar.html)
```

#### Customize plot
```
p = figure(plot_width=1000, plot_height=600, tools=["pan", "wheel_zoom", "box_zoom", "reset", "tap"], toolbar_location="right", title="IRMOF-1 DMOG Conformers Adsorption)
```

#### Add hover tool
```
from bokeh.plotting import figure, output_file, show, ColumnDataSource, output_notebook
from bokeh.models import HoverTool
from bokeh.resources import CDN
from bokeh.embed import file_html
```

#### Save html file

3. Add html file to webpage
---------------------------
- Add file to repo
- Add link to file in config.yml
