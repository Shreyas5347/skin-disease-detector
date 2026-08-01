import os
import shutil
import pandas as pd

# Path to where you extracted the dataset
CSV_PATH = 'C:/Users/LENOVO/Skin Disease Detector/model_training/HAM10000_metadata.csv'
IMAGES_PATH = 'C:/Users/LENOVO/Skin Disease Detector/model_training/all_images/'   # folder with all raw images
OUTPUT_PATH = 'C:/Users/LENOVO/Skin Disease Detector/model_training/dataset/organized/'

df = pd.read_csv(CSV_PATH)

# Class name mapping
class_map = {
    'mel': 'melanoma',
    'nv': 'nevus',
    'bcc': 'basal_cell_carcinoma',
    'akiec': 'actinic_keratosis',
    'bkl': 'benign_keratosis',
    'df': 'dermatofibroma',
    'vasc': 'vascular_lesion'
}

# Split 80% train, 20% val
from sklearn.model_selection import train_test_split
train_df, val_df = train_test_split(df, test_size=0.2, 
                                     stratify=df['dx'],  
                                     random_state=42)

def copy_images(dataframe, split_name):
    for _, row in dataframe.iterrows():
        label = class_map[row['dx']]
        img_name = row['image_id'] + '.jpg'
        src = os.path.join(IMAGES_PATH, img_name)
        dst_folder = os.path.join(OUTPUT_PATH, split_name, label)
        os.makedirs(dst_folder, exist_ok=True)
        if os.path.exists(src):
            shutil.copy(src, dst_folder)

copy_images(train_df, 'train')
copy_images(val_df, 'val')

print("Done! Dataset organized.")