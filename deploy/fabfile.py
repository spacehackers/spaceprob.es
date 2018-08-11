from __future__ import print_function
import sys
from fabric.api import lcd, local, abort, prompt
from fabric.contrib.console import confirm
from secrets import GIT_REPO, LOCAL_PROJECT_PATH, PROD_USER, PROD_HOST, PROD_PATH

PROD_PATH = PROD_PATH.rstrip('/')

def deploy():
    """ this method checks out the repo into a local temp directory,
        builds the jekyll _site folder there, and then rsyncs _site folder to remote server """
    print("checking out codebase...")

    msg =  """
            Please say:

            fab deploy production
            """

    try:
        if sys.argv[2] != 'production':
            print(msg)

    except IndexError:
        print(msg)

def production():
    print("deploying to production")
    with lcd("{}".format(LOCAL_PROJECT_PATH)):
        local("bundle exec jekyll build")
        rsync_call = "rsync -r -vc -e ssh --exclude .git --exclude venv _site/ {}@{}:{}".format(PROD_USER, PROD_HOST, PROD_PATH)
        local(rsync_call)
