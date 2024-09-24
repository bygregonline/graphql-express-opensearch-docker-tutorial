import os
import json
from opensearchpy import OpenSearch, helpers
from opensearchpy import client

from tqdm import tqdm

index_name = os.getenv('INDEX_NAME')


def __get_client() -> client.OpenSearch:
    username = os.getenv('OPENSEARCH_USERNAME')
    password = os.getenv('OPENSEARCH_PASSWORD')
    host = os.getenv('HOST')
    port = os.getenv('PORT')

    print('username: ', username)
    print('password: ', password)
    print('host: ', host)
    print('port: ', port)
    print('index_name: ', index_name)

    client = OpenSearch(
        hosts=[{'host': host, port: 9200}],
        http_compress=True,  # ¡Importante para la compresión!
        # Sustituir con las credenciales reales si se han cambiado
        http_auth=(username, password),
        use_ssl=False,
        verify_certs=False,
        ssl_assert_hostname=False,
        ssl_show_warn=False)

    return client


def main():
    f = open('data.json')
    aux = json.load(f)
    c = __get_client()

    if c.indices.exists(index=index_name):
        try:
            # Eliminar el índice si existe

            response = c.indices.delete(index=index_name)
            print(f'index {index_name} deleted: {response}')
        except Exception as e:
            print(f'Error al eliminar el índice: {e}')
    c.indices.create(index=index_name, ignore=400)
    for a in tqdm(aux):
        c.index(index_name,
                body=a,
                refresh=True
                )


if __name__ == '__main__':
    main()
