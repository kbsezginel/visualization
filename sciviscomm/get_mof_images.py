"""
Generate MOF images using OpenBabel
"""
import os
import glob
import yaml
import subprocess

img_dir = '/home/kutay/Documents/git/visualization/sciviscomm/img'
mof_dir = '/home/kutay/Documents/Research/MOFs/CORE_ALL'

with open('mofs.yaml', 'r') as yf:
    mof_list = yaml.load(yf)

for mof in mof_list:
    mof_file = glob.glob(os.path.join(mof_dir, '%s*.cif' % mof))[0]
    print(mof_file)
    img_file = os.path.join(img_dir, '%s.svg' % mof)
    subprocess.call(['obabel', mof_file, '-O', img_file, '-xS', '-xd', '-xb', 'none'])
