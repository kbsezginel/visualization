"""
Setup Blender sequencer.
"""
import os
from glob import glob
import subprocess
import pickle
from PIL import Image


img_dir = ''
file_format = 'png'
script = 'blender_sequencer.py'
pickle_file = 'vid-config.pkl'
verbose = True
config = {'fps': 30, 'background_color': (1.0, 1.0, 1.0), 'background_image': '', 'file_format': 'AVI_JPEG',
          'save': '', 'render': True}
# --------------------------------------------------------------------------------------------------
images = glob(os.path.join(img_dir, '*.%s' % file_format))
nums = [int(x.replace('.png', '').split('-')[1]) for x in images]
images = [i for _, i in sorted(zip(nums, images))]
config['images'] = images

# Set video resolution from first image
im = Image.open(images[0])
config['resolution'] = im.size

# Write config file
with open(pickle_file, 'wb') as handle:
    pickle.dump(config, handle, protocol=pickle.HIGHEST_PROTOCOL)

# Run Blender
command = ['blender', '--background', '--python', script, '--', pickle_file]
with open(os.devnull, 'w') as null:
    blend = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = blend.stdout.decode(), blend.stderr.decode()
    if verbose:
        print("Stdout:\n\n%s\nStderr:\n%s" % (stdout, stderr))

# Remove config file
if os.path.exists(pickle_file):
    os.remove(pickle_file)
