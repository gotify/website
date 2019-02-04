---
id: apache
title: apache config
---

You can use apache to make a reverse proxy if you have many container.

```apache
<VirtualHost *:80>                                                               
        ServerName domain.tld                                              
        Redirect / https://domain.tld /                                     
        ServerSignature Off                                                      
</VirtualHost>                                                                   
                                                                                 
<VirtualHost *:443>                                                              
        ServerName domain.tld                                               
                                                                                 
        SSLEngine On                                                             
                                                                                 
        ProxyPass "/stream" ws://127.0.0.1:GOTIFY_SERVER_PORT/ retry=0 timeout=5               
        ProxyPass "/" http://127.0.0.1:GOTIFY_SERVER_PORT/ retry=0 timeout=5                   
        ProxyPassReverse / http://127.0.0.1:GOTIFY_SERVER_PORT/                                
        ServerSignature Off                                                      
        Keepalive On                                                             
        CustomLog /var/log/apache2/push_access.log combined                      
        ErrorLog /var/log/apache2/push_error.log                                 
                                                                                 
        Include /etc/letsencrypt/options-ssl-apache.conf                         
        Include /etc/letsencrypt/options-ssl-apache.conf                         
        SSLCertificateFile /etc/letsencrypt/live/domain.tld/fullchain.pem  
        SSLCertificateKeyFile /etc/letsencrypt/live/domain.tld/privkey.pem 
</VirtualHost>      
```
