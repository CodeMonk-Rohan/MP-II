import os
import sys
from yt_dlp import YoutubeDL

import logging

# Configure logging
logging.basicConfig(level=logging.ERROR)

# #this is subject to change, need a better way of doing things
# OUTPUT_DIR = "C:\\Users\\Admin\\Desktop\\Music\\Database"

#found a better way lmao


def download(playlist_url, playlist_name, OUTPUT_DIR :str):
    
    OUTPUT_DIR = OUTPUT_DIR.strip()
    print(OUTPUT_DIR)
    count = 0

    def custom_hook(d):
        nonlocal count
        nonlocal video_count
        if d['status'] == 'finished':
            count += 1
            print(f"\r{count}/{video_count}", end="", flush="")
        else:
            pass

    # Configuration settings for YT-DLP
    config = {
        'quiet': True,  # supress default output of the yt-dlp command line tool
        'format': 'bestaudio/best',       # Download best audio quality
        # Output template for downloaded files
        'outtmpl': f'{OUTPUT_DIR}/{playlist_name}/%(title)s.%(ext)s',
        # custom output hooks, for interprocess communication with the Electron Application
        'progress_hooks': [custom_hook],

        'playliststart': 1,                # Start downloading from playlist item 1
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',  # Extract audio
            'preferredcodec': 'mp3',       # Preferred audio codec
            'preferredquality': '192',     # Preferred audio quality
        }],
        # txt file that is used to prevent duplicate downloads
        'download_archive': f'{OUTPUT_DIR}/{playlist_name}/{playlist_name}_keys.txt',
    }

    # Get preliminary information about the playlist
    preConfig = {
        'quiet': True,  # Suppress standard output
        'extract_flat': True,  # Extract flat playlist information
        'force_generic_extractor': True,  # Force generic extractor to get playlist
    }
    with YoutubeDL(preConfig) as DL:
        initialInfo = DL.extract_info(playlist_url, download=False)
        # print(pprint.pformat(initialInfo.keys()),"\n", pprint.pformat(initialInfo))
        video_count = initialInfo['playlist_count']

    DL = YoutubeDL(config)
    info = DL.extract_info(playlist_url, download=True)

    playlist_folder = f"{OUTPUT_DIR}\\{playlist_name}"
    playlist_music_set = playlist_name + ".txt"

    path_to_music_set = f"{playlist_folder}\\{playlist_music_set}"
    # print(path_to_music_set)
    existing_music = loadMusicPaths(path_to_music_set)
    writeMusicPaths(directory=playlist_folder,
                    existing_music=existing_music, target_file=path_to_music_set)


def loadMusicPaths(path) -> set[str]:
    paths = set()
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            for line in file:
                file_path = line.strip()
                paths.add(file_path)
                # print(path)
    return paths


def getMP3paths(directory) -> set[str]:
    paths = set()
    for file in os.listdir(directory):
        path = os.path.join(directory, file)
        if file.endswith('.mp3'):
            paths.add(path)
            # print(path)

    return paths


def writeMusicPaths(directory, existing_music, target_file):
    # print("Target: ", target_file)
    updated_music_set = getMP3paths(directory)
    new_music = updated_music_set - existing_music

    try:
        with open(target_file, 'a', encoding='utf-8') as file:
            for music in new_music:
                file.writelines(music + "\n")
    except Exception as e:
        print("Error:", e)

#test code
# data = getMP3paths("C:\\Users\\Admin\\Desktop\\Music\\Database\\結構")
# print(data)
# dummy_url = "https://youtube.com/playlist?list=PLAtpKAUoxXic6XroxqWVp65Ie9aJCbILl&si=fzHsg8hQXQe_EqCS"
# download(dummy_url, "Test", "C:/Users/Admin/Desktop/MP-II/alpha-1.4/dist-electron/data")

if __name__ == "__main__":

    url = sys.argv[1]
    name = sys.argv[2]
    OUTPUT_DIR = sys.argv[3]
    download(url, name, OUTPUT_DIR)
