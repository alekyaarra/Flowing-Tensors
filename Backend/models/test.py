def emotion_model(path):
    import numpy as np # linear algebra
    import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
    import librosa
    import librosa.display
    import matplotlib.pyplot as plt
    import plotly.graph_objects as go
    import plotly.express as px
    import plotly.figure_factory as ff
    import seaborn as sns
    #import IPython
    import tensorflow as tf
    from tensorflow import keras
    import keras.layers as L
    #import tensorflow.keras.layers as L
    import tensorflow as tf
    from keras.callbacks import EarlyStopping, ReduceLROnPlateau
    from tensorflow.keras.utils import to_categorical
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import confusion_matrix
    from sklearn.metrics import classification_report
    from sklearn.preprocessing import LabelEncoder,StandardScaler
    import re
    import warnings
    warnings.filterwarnings('ignore')
    import itertools
    import os

    mod = tf.keras.models.load_model('model.h5')

    paths = [path]
    for i in paths:
        input_path = i

        def add_noise(data,random=False,rate=0.035,threshold=0.075):
            if random:
                rate=np.random.random()*threshold
            noise=rate*np.random.uniform()*np.amax(data)
            augmented_data=data+noise*np.random.normal(size=data.shape[0])
            return augmented_data

        def shifting(data,rate=1000):
            augmented_data=int(np.random.uniform(low=-5,high=5)*rate)
            augmented_data=np.roll(data,augmented_data)
            return augmented_data

        def pitching(data,sr,pitch_factor=0.7,random=False):
            if random:
                pitch_factor=np.random.random() * pitch_factor
            return librosa.effects.pitch_shift(data,sr=sr,n_steps=pitch_factor)

        def streching(data,rate=0.8):
            return librosa.effects.time_stretch(data,rate)


        def zcr(data,frame_length,hop_length):
            zcr=librosa.feature.zero_crossing_rate(data,frame_length=frame_length,hop_length=hop_length)
            return np.squeeze(zcr)
        def rmse(data,frame_length=2048,hop_length=512):
            rmse=librosa.feature.rms(y=data,frame_length=frame_length,hop_length=hop_length)
            return np.squeeze(rmse)
        def mfcc(data,sr,frame_length=2048,hop_length=512,flatten:bool=True):
            mfcc=librosa.feature.mfcc(y=data,sr=sr)
            return np.squeeze(mfcc.T)if not flatten else np.ravel(mfcc.T)

        def extract_features(data,sr,frame_length=2048,hop_length=512):
            result=np.array([])
            
            result=np.hstack((result,
                            zcr(data,frame_length,hop_length),
                            rmse(data,frame_length,hop_length),
                            mfcc(data,sr,frame_length,hop_length)
                            ))
            return result

        def get_features(path,duration=2.5, offset=0.6):
            data,sr=librosa.load(path,duration=duration,offset=offset)
            aud=extract_features(data,sr)
            audio=np.array(aud)
            
            noised_audio=add_noise(data,random=True)
            aud2=extract_features(noised_audio,sr)
            audio=np.vstack((audio,aud2))
            
            pitched_audio=pitching(data,sr,random=True)
            aud3=extract_features(pitched_audio,sr)
            audio=np.vstack((audio,aud3))
            
            pitched_audio1=pitching(data,sr,random=True)
            pitched_noised_audio=add_noise(pitched_audio1,random=True)
            aud4=extract_features(pitched_noised_audio,sr)
            audio=np.vstack((audio,aud4))
            
            return audio

        X =[]
        features = get_features(input_path)
        for i in features:
            X.append(i)

        extract=pd.DataFrame(X)
        extract=extract.fillna(0)

        rows_to_add = 2376 - int(extract.shape[1])
        zeros_df = pd.DataFrame(data=[[0]*rows_to_add]*4)

        new_df = pd.concat([extract, zeros_df], ignore_index=True, axis=1)
        # print(new_df.shape, new_df)

        y_pred = mod.predict(new_df)
        y_pred = np.argmax(y_pred, axis=1)
        output = int(np.average(y_pred))
        # return output
        #print(output)
        return output


