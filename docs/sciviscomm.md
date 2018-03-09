SciVisComm Guest Lecture
========================

Web Based Interactive Scientific Communication
----------------------------------------------

### 1. Creating a webpage using GitHub pages
- First create a GitHub account: https://github.com/
- Go to this link: https://github.com/kbsezginel/gh-pages-template
- Follow this tutorial: https://kbsezginel.github.io/gh-pages-template/setup

### 2. Interactive plotting with *bokeh*, a Python package
- Make sure you have Python installed (preferably through Conda)
- Install matplotlib and bokeh Python packages
    - If using conda (Miniconda or Anaconda installation):
```
conda install bokeh
```
    - If using regular Python installation:
```
pip install bokeh
```

Here is a tutorial I made that shows an example of bokeh library for interactive scatter plot:
https://kbsezginel.github.io/research/conformers-bokeh/

Here is the plot in action:
https://kbsezginel.github.io/irmof1dmog/

### 3. Adding the plot to the webpage
- Go to your GitHub page repository.
- Add the html file using *Upload files* button.
- Edit *_config.yml* file and add your file to the navigation bar. The url should be the same as your html file name. Ex: url for *plot.html* should be *plot*.
- The plot should be available by clicking the link in the sidebar or through *username*.github.io/*filename*.
