import numpy as np


def morse_potential(dist, depth, width, eq_dist):
    """ Morse potential as implemented in LAMMPS. """
    return (depth * np.power((1 - np.exp(-width*(dist - eq_dist))), 2))


def harmonic_potential(dist, k, eq_dist):
    """ Harmonic potential """
    return (k * np.power(dist - eq_dist, 2))


def class2_potential(dist, k2, k3, k4, eq_dist):
    """ Class2 potential """
    energy = (k2 * np.power(dist - eq_dist, 2))
    energy += (k3 * np.power(dist - eq_dist, 3))
    energy += (k4 * np.power(dist - eq_dist, 4))
    return energy


def nonlinear_potential(dist, eps, max_extension, eq_dist):
    """ Nonlinear potential """
    dr = np.power((dist - eq_dist), 2)
    return (eps * dr / (np.power(max_extension, 2) - dr))
