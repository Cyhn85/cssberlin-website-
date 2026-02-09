import os
import shutil

source_dir = 'temp_app'
dest_dir = '.'

# Get all files and directories in the source directory
for item in os.listdir(source_dir):
    source_item = os.path.join(source_dir, item)
    dest_item = os.path.join(dest_dir, item)
    
    # If the destination item already exists, remove it (except special reserved ones if any, but this is a fresh install over empty-ish dir)
    if os.path.exists(dest_item):
        if os.path.isdir(dest_item):
            shutil.rmtree(dest_item)
        else:
            os.remove(dest_item)
            
    # Move the item
    shutil.move(source_item, dest_item)

# Remove the empty source directory
os.rmdir(source_dir)
