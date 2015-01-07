from fabric.api import lcd, local
from secrets import GIT_REPO, LOCAL_PATH, DEV_USER, DEV_URL, DEV_PATH

GIT_BRANCH = 'master'

def deploy():

    # remove any old checked out rep and grab the latest
    with lcd(LOCAL_PATH):
        local('rm -rf spaceprobes')
        local("git clone -b %s %s" % (GIT_BRANCH, GIT_REPO))

    # build the _site directory and rsync it
    with lcd("%s/%s" % (LOCAL_PATH, 'spaceprobes/')):
        local("jekyll build")
        local("rsync -r -vc -e ssh --exclude .git --exclude venv _site/ %s@%s:%s" % (DEV_USER, DEV_URL,DEV_PATH))


