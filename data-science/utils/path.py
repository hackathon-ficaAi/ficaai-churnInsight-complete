# utils/path.py
import os
import sys

def setup_project_root(levels_up=1):
    """
    Garante que o diretório raiz do projeto esteja no sys.path.

    levels_up:
        quantos níveis acima do arquivo chamador está o root
        scripts/train.py -> root = 1 nível acima
    """
    try:
        caller_file = __file__
        base_dir = os.path.dirname(caller_file)
    except NameError:
        # fallback para ambientes interativos
        base_dir = os.getcwd()

    project_root = base_dir
    for _ in range(levels_up):
        project_root = os.path.dirname(project_root)

    project_root = os.path.abspath(project_root)

    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    return project_root