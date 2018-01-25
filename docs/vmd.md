# VMD Visualization

In [VMD]() you can save the representations you selected so that you can automatically apply them
to any trajectory.

## Adding simulation box

```
pbc set {a b c alpha beta gamma} -all
pbc box_draw -shiftcenterrel  {x y z}
```
### Example:
```
pbc set {35 35 40 90 90 90} -all
pbc box_draw -shiftcenterrel  {0 0 0}
```
If you are gonna use this command from the command-line then you would need to load the
`pbctools` package first or the `pbc` command will not be recognized.

```
package require pbctools
pbc set {35 35 40 90 90 90} -all
pbc box_draw -shiftcenterrel  {0 0 0}
```
> [More on adding a box and pbctools](http://www.ks.uiuc.edu/Research/vmd/plugins/pbctools/)

## Rendering an image

Images can be rendered with `render` command in VMD.

### Usage
```
render <method> <filename>
```

### Example:
```
render TachyonInternal snapshot.rgb
```

### Rendering multiple frames
We can use a for loop and the `render` command to render all images in the trajectory file as follows:
```
for {set i 0} {$i < $num} {incr i} {
  # go to the given frame
  animate goto $i
  # force display update
  display update
  # take the picture
  render TachyonInternal [format snapshot.%04d.rgb $i]
}
```
Here image files with names such as `snapshot.0000.rgb, snapshot.0001.rgb, snapshot.0002.rgb, ...`
are generated.

> [VMD Render Documentation](http://www.ks.uiuc.edu/Research/vmd/current/ug/node147.html)

## Creating a movie from images

Following line would read all files formatted as `shapshot.<number>.rgb` using the rendering script above.
```
exec convert shapshot.*.rgb movie.gif
```

### Adding delay, looping multiple times
```
exec convert -delay 10 -loop 2 shapshot.*.rgb movie.gif
```

## Generating movies from the command line

You can generate a movie using a VMD '`tcl` script file.
These files can be generated easily using a visualization state.
Once you create a template with the representations you like, save it as a visualization state.
The file you save is basically a list of instructions (`tcl` script) that tells VMD how to
represent your molecules.
Adding the necessary instructions to render images in a frame and convert to movie you can generate
a script that would read your trajectory file and output an animated movie without even loading VMD.
Moreover, you can even add that scipt at the end of your MD simulation so it would generate a movie
directly after the simulation is finished.

### Running tcl script with VMD from the command line
```
vmd -dispdev text -eofexit < input.tcl > output.log
```

> [VMD Command-Line Options](http://www.ks.uiuc.edu/Research/vmd/vmd-1.8.7/ug/node204.html)
