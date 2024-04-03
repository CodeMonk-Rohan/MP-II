from yt_dlp import YoutubeDL
import pprint
import os
import customLogger
import sys

# URL = "https://www.youtube.com/playlist?list=PLAtpKAUoxXifewNw-KcqH_lafYGC343sc"
# URL = "https://www.youtube.com/playlist?list=PLAtpKAUoxXic6XroxqWVp65Ie9aJCbILl"

OUTPUT_DIR = os.path.join(os.getcwd(), "dist-electron", "data")


def custom_hook(d, name):
    # This hook is called for each video within the playlist.
    if d['status'] == 'finished':
        print('Finished Downloading, Commencing post processing.')
        file_path = d['filename']
        # print(f"Filepath: ${file_path}", flush=True)

        with open(os.path.join(OUTPUT_DIR, name, "downloaded_files.txt"), 'a', encoding='utf-8') as f:
            f.write(file_path + '\n')
            # print(f"writing {file_path} to {name}/downloaded_files.txt")
        # print('Downloaded:', file_path)


def downloadPlaylist(name: str, url: str):
    # configuration for the download
    ydl_opts = {
        'format': 'm4a/bestaudio/best',
        # combining the small little files sent over by youtube into a playable music file, via ffmpeg
        'postprocessors': [
            {
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',  # used to be m4a for reference
            }
        ],
        'logger': customLogger.customLogger(),

        # progress hooks only take a function, and I needed to inject playlist name into it, hence the lambda function
        'progress_hooks': [lambda d, name=name: custom_hook(d, name)],

        'outtmpl': f'{OUTPUT_DIR}\\{name}\\%(title)s.%(ext)s',

        'download_archive': f'{OUTPUT_DIR}\\{name}\\{name}_keys.txt'

    }

    with YoutubeDL(ydl_opts) as ydl:
        output = ydl.extract_info(url, download=True)

        pprint.pprint(output["playlist_count"])
        pprint.pprint(output["title"])


if __name__ == "__main__":
    name = sys.argv[1]
    url = sys.argv[2]
    try:
        os.mkdir(os.path.join(OUTPUT_DIR, name))
        with open(os.path.join(OUTPUT_DIR, name, "downloaded_files.txt"), 'w', encoding='utf-8') as file:
            file.write("")

    except FileExistsError:
        print("File already exists")

    print(f"Name: {name} \n URL: {url}\n")
    downloadPlaylist(name, url)
    # print("------------------")
    # print(OUTPUT_DIR)
