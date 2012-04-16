<?

$conf['endpoint']['local'] = 'http://localhost:3030/poder/query';
$conf['update_endpoint']['local'] = 'http://localhost:3030/poder/update';
$conf['home'] = '/var/www/bio/lodspeakr/';  #Change your location
$conf['basedir'] = 'http://alia/bio/';      #Change to your configuration
$conf['debug'] = false;
$conf['mirror_external_uris'] = 'http://poderopedia.com/vocab/';

/*ATTENTION: By default this application is available to
 * be exported and copied (its configuration)
 * by others. If you do not want that, 
 * turn the next option as false
 */ 
$conf['export'] = true;

#If you want to add/overrid a namespace, add it here
$conf['ns']['vocab']   = 'http://poderopedia.com/vocab/'; 
$conf['ns']['local']   = $conf['mirror_external_uris'];
$conf['ns']['poder']   = $conf['ns']['local'];
$conf['ns']['base']   = 'http://alia/bio/';

$lodspk['vocab'] = 'http://poderopedia.com/vocab';
$lodspk['instances'] = 'http://poderopedia.com/instances';
$lodspk['layout'] = 'http://poderopedia.com/layout';
$lodspk['prefixes'] = '
PREFIX local: <http://poderopedia.com/instances/> 
PREFIX poder: <http://poderopedia.com/instances/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX base: <http://poderopedia.com/instances/>
PREFIX vocab: <http://poderopedia.com/vocab/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
PREFIX dctype: <http://purl.org/dc/dcmitype/> 
PREFIX dct: <http://purl.org/dc/terms/> 
PREFIX dc: <http://purl.org/dc/elements/1.1/> 
PREFIX owl: <http://www.w3.org/2002/07/owl#> 
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
PREFIX ns0: <http://iandavis.com/id/> 
PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
PREFIX ov: <http://open.vocab.org/terms/> 
PREFIX ns1: <http://lists.foaf-project.org/mailman/listinfo/> 
PREFIX vann: <http://purl.org/vocab/vann/> 
PREFIX bio: <http://purl.org/vocab/bio/0.1/> 
PREFIX msg0: <http://web.resource.org/cc/> 
PREFIX ns2: <http://purl.org/NET/c4dm/event.owl#> 
PREFIX cyc: <http://sw.opencyc.org/2009/04/07/concept/en/> 
PREFIX ns3: <http://linkedevents.org/ontology/> 
PREFIX status: <http://www.w3.org/2003/06/sw-vocab-status/ns#> 
PREFIX mo: <http://purl.org/ontology/mo/> 
PREFIX ns4: <http://www.w3.org/2006/time#> 
PREFIX rel: <http://purl.org/vocab/relationship/> 
PREFIX label: <http://purl.org/net/vocab/2004/03/label#> 
PREFIX layout: <http://graves.cl/layout/> 
';
$conf['root'] = 'home';
?>
