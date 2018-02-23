"""
Create a VMD (tcl) script to render a trajectory file into a move.
"""
import os
import subprocess


class VMD:
    def __init__(self, par_set=None):
        if par_set is not None:
            self.set(par_set)
        else:
            self.set(default_parameters.copy())

    def run(self):
        """ Run VMD as subprocess """
        ['vmd', '-dispdev', 'text', '-eofexit', '<', self.input]
        for par in par_set:
            setattr(self, par, deepcopy(par_set[par]))
