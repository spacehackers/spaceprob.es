from __future__ import print_function
from fabric.api import lcd, local, abort
from fabric.contrib.console import confirm
from secrets import GIT_REPO, LOCAL_TEMP_DIR, DEV_USER, DEV_URL, DEV_PATH

GIT_BRANCH = 'master'  # this is what branch it will deploy
DEPLOY_DIR_NAME = 'spaceprobes_deploy'  # extra dir inside of LOCAL_TEMP_DIR just in case conflicts

def deploy():
    """ this method checks out the repo into a local temp directory,
    builds the jekyll _site folder there, and then rsyncs _site folder to remote server """

    # remove any old checked out repo and grab the latest
    with lcd(LOCAL_TEMP_DIR):
        local('rm -rf %s' % DEPLOY_DIR_NAME)  #
        local('mkdir %s' % DEPLOY_DIR_NAME)  # this extra directory makes it a lil safer futzing around

    with lcd("%s%s/" % (LOCAL_TEMP_DIR, DEPLOY_DIR_NAME)):
        print("cloning into %s%s/" % (LOCAL_TEMP_DIR, DEPLOY_DIR_NAME))
        local("git clone -b %s %s" % (GIT_BRANCH, GIT_REPO))

    # build the _site directory and rsync it
    with lcd("%s%s/%s/" % (LOCAL_TEMP_DIR, DEPLOY_DIR_NAME, 'spaceprobes')):
        local("jekyll build")
        local("rsync -r -vc -e ssh --exclude .git --exclude venv _site/ %s@%s:%s" % (DEV_USER, DEV_URL,DEV_PATH))


