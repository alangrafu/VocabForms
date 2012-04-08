<?

$conf['endpoint']['local'] = 'http://localhost:3031/poder/query';
$conf['update_endpoint']['local'] = 'http://alia:3031/poder/update';
$conf['home'] = '/var/www/bio/lodspeakr/';
$conf['basedir'] = 'http://alia/bio/';
$conf['debug'] = false;
$conf['mirror_external_uris'] = 'http://poderopedia.com/vocab/';

/*ATTENTION: By default this application is available to
 * be exported and copied (its configuration)
 * by others. If you do not want that, 
 * turn the next option as false
 */ 
$conf['export'] = true;

#If you want to add/overrid a namespace, add it here
$conf['ns']['local']   = $conf['mirror_external_uris'];
$conf['ns']['poder']   = $conf['ns']['local'];
$conf['ns']['base']   = 'http://alia/bio/';

$lodspk['g'] = 'http://poderopedia.com/vocab';
$lodspk['instances'] = 'http://poderopedia/instances';
?>
