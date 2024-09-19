# -*- coding: utf-8 -*-
import sys, pyexcel, re,json, types
from datetime import datetime
# Leer el documento de excel
def read_excel_sheets(sheet_name=None, file_url=None, all_sheets=False):
    try:
        sheet = pyexcel.get_book_dict(file_name = file_url)
        for s in sheet:
            all_records = sheet[s]
            header = all_records.pop(0)
            header = [col.lower().replace(u'\xa0',u' ').strip().replace(' ', '_') for col in header]
            return header, all_records
    except Exception as e:
        print( json.dumps({'error': 'Ocurrio un error al leer el documento Excel', 'msg': str(e)}) )

def make_header_dict(header):
    header_dict = {}
    for position in range(len(header)):
        header_dict[header[position].lower().replace(' ' ,'_')] = position
    return header_dict

def quit_acentos(cadena):
    dict_replace = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }
    for a, aa in dict_replace.items():
        cadena = cadena.replace( a, aa )
    return cadena

def header_without_acentos(header):
    new_header = []
    for h in header:
        new_header.append( quit_acentos( h ) )
    return new_header

def list_to_str(list_to_proccess):
    str_return = ''
    for i, value in enumerate(list_to_proccess):
        if isinstance(value, types.UnicodeType):
            list_to_proccess[i] = value.encode('utf8')
    str_return += ', '.join([a for a in list_to_proccess if a])
    return str_return

"""
# Reemplazar los valores de la lista con los que son aceptados segun el diccionario
"""
def replace_name_col( dict_cols_to_eval, header_to_eval ):
    for i in dict_cols_to_eval:
        if not i in header_to_eval:
            other_values = dict_cols_to_eval[i]['list_accepted']
            p = None
            for j in other_values:
                try:
                    p = header_to_eval.index( j )
                    break
                except:
                    p = None
            if p != None:
                header_to_eval[ p ] = i
    return header_to_eval

"""
# Revisa que tenga las columnas necesarias para el proceso
"""
def eval_header_names( header_sin_acentos ):
    dict_cols_names = {
        'folio': { 'list_accepted': [], 'required': True },
        'numero_de_tarjeta': { 'list_accepted': ['tarjeta'], 'required': True },
        'fecha_de_venta': { 'list_accepted': ['fecha', 'fecha_venta'], 'required': True },
        'monto': { 'list_accepted': ['monto_de_la_venta', 'monto_venta', 'monto_de_venta'], 'required': False },
    }

    # Reemplazo en la cabecera el nombre de la columna según el valor aceptado
    header_sin_acentos = replace_name_col( dict_cols_names, header_sin_acentos )

    required_cols = [ i for i in dict_cols_names if dict_cols_names[i]['required'] ]
    required_not_found = list( set(required_cols) - set(header_sin_acentos) )
    return required_not_found, dict_cols_names

if __name__ == "__main__":
    name_file = sys.argv[1]
    # Dirección donde está guardado el Excel
    # Windows
    file_url = 'C:/xampp/htdocs/sistemaponchov2/excel_files_folios/{}.xlsx'.format(name_file)
    # Ubuntu
    #file_url = '/var/www/html/sistemaponchov2/excel_files_folios/{}.xlsx'.format(name_file)
    #print (file_url)
    
    # Obtengo un diccionario con las páginas y el contenido de cada una
    header, records = read_excel_sheets(file_url=file_url)

    # Quito los acentos de las columnas para no tener problema
    header_sin_acentos = header_without_acentos(header)

    # Reviso que todas el documento tenga las columnas requeridas para el proceso, de lo contrario se manda error
    cols_not_found, dict_all_names = eval_header_names( header_sin_acentos )
    if cols_not_found:
        print( json.dumps({
            'error': 'Ocurrio un error al leer el documento Excel', 
            'msg': 'No se encontraron las columnas: {}'.format( list_to_str( cols_not_found ) )
        }) )
    else:
        header_dict = make_header_dict(header_sin_acentos)
        fetch_records = []
        for rec in records:
            info_record = {}
            for h in header_dict:
                info_cell = rec[ header_dict[ h ] ]
                if isinstance(info_cell, datetime):
                    info_cell = info_cell.strftime('%Y-%m-%d')
                try:
                    if re.match(r"\d+(-|\/)\d+(-|\/)\d+", str(info_cell)):
                        info_cell = info_cell.replace('/', '-')
                        info_cell = datetime.strptime(info_cell, '%d-%m-%Y')
                        info_cell = info_cell.strftime('%Y-%m-%d')
                except:
                    pass
                if h in ('folio', 'numero_de_tarjeta'):
                    info_record.update({h: str(info_cell)})
                    continue
                info_record.update({
                    h: info_cell
                })
            fetch_records.append(info_record)
        print(json.dumps(fetch_records))
    #print ( json.dumps({ 'records': records }) )
    # dict_totales_found, full_date = process_diesel_sheet( dict_all_sheets_excel.get('diesel', {}).get('records', []) )
    # dict_ventas_clientes = process_notas_sheet( dict_all_sheets_excel.get('notas', {}).get('records', []) )
    # print( json.dumps( {
    #     'full_date': full_date,
    #     'totales': dict_totales_found,
    #     'clientes': dict_ventas_clientes
    #     } ) )