import os

en_dir = "_i18n/en/_posts/"
tr_dir = "_i18n/tr/_posts/"

# collect english pages
en_pages = []
for dirName, subdirList, fileList in os.walk(en_dir):
    print('Found directory: %s' % dirName)
    for fname in fileList:
        if 'markdown' in fname:
            en_pages.append(fname)

# collect Turkish pages
tr_pages = []
for dirName, subdirList, fileList in os.walk(tr_dir):
    print('Found directory: %s' % dirName)
    for fname in fileList:
        if 'markdown' in fname:
            tr_pages.append(fname)

gh_base_url = 'https://github.com/basilleaf/spaceprob.es/blob/master/_i18n/en/_posts/'
print("\n".join([gh_base_url + page for page in en_pages if page not in tr_pages]))
