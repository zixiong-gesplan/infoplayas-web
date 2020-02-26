export const environment = {
    production: true,
    infoplayas_catalogo_edicion_url: 'https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer/0',
    infoplayas_catalogo_edicion_tablas_url: 'https://utility.arcgis.com/usrsvcs/servers/070539cded6d4f5e8aa2ce1566618acd/rest/services/ag17_023_fase_2/playas_catalogo_edicion/FeatureServer',
    idportalForms: '4df033868833441798c532394806601c',
    idportalView: '81e40ab3616b4b4386058593078eaddf',
    idportalDrownings: '81e2f8adabc04ebb8572bd715696cf54',
    urlServerRest: 'https://gesplan.maps.arcgis.com/sharing/rest',
    urlSelfinfo: '/community/self',
    urlPlanos: 'https://www.infoplayascanarias.es/planos/',
    roles: [
        {
            id: '6eaujmQDyuNamfzU',
            name: 'infoplayas',
            inc_visual: true,
            inc_edit: true,
            plan_visual: true,
            plan_edit: true,
            scope: 'ayto',
            catalogue_edit: false
        },
        {
            id: '73z1ex3Y6Gjeba6e',
            name: 'infoplayas_gest',
            inc_visual: true,
            inc_edit: true,
            plan_visual: true,
            plan_edit: true,
            scope: 'todos',
            catalogue_edit: true
        },
        {
            id: 'PccS59DlcDquITjj',
            name: 'infoplayas_inc',
            inc_visual: true,
            inc_edit: true,
            plan_visual: false,
            plan_edit: false,
            scope: 'ayto',
            catalogue_edit: false
        },
        {
            id: '4NMdR9hVpKr0CG7r',
            name: 'infoplayas_gob',
            inc_visual: true,
            inc_edit: true,
            plan_visual: true,
            plan_edit: false,
            scope: 'todos',
            catalogue_edit: false
        },
        {
            id: 'pNHGBRR3LVB6u2e0',
            name: 'infoplayas_visor',
            inc_visual: true,
            inc_edit: false,
            plan_visual: true,
            plan_edit: false,
            scope: 'todos',
            catalogue_edit: false
        }
    ],
    istac: 'https://www3.gobiernodecanarias.org/istac/api/indicators/v1.0/indicators/',
    client_id: 'RNiCC2e9tgwl1mCV',
    urlAuthorize: 'https://www.arcgis.com/sharing/rest/oauth2/authorize',
    urlRevokeToken: 'https://www.arcgis.com/sharing/rest/oauth2/revokeToken',
    urlimageweather: 'https://openweathermap.org/img/w/',
    // TODO sustituir para alojamiento definitivo 'https://infoplayascanarias.es/login' sustituir para pruebas en servi15 con redirectUri: 'https://servi15.tf.gesplan.es/infoplayascanarias/login',
    redirectUri: 'https://infoplayascanarias.es/playas/login',
    dataSvgGradeHigh: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNTEyLjAwMTQwMzgwODU5MzgiIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMiI+PHJlY3QgaWQ9ImJhY2tncm91bmRyZWN0IiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz4KCjxnIGNsYXNzPSJjdXJyZW50TGF5ZXIiIHN0eWxlPSIiPjx0aXRsZT5MYXllciAxPC90aXRsZT48cmVjdCBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMyMjIyMjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWRhc2hvZmZzZXQ9IiIgZmlsbC1ydWxlPSJub256ZXJvIiBpZD0ic3ZnXzMiIHg9IjYyLjI5NjcwMzMzODYyMzA1IiB5PSIxMjYuNjkyMzA3OTQ5MDY2MTYiIHdpZHRoPSIzMTUiIGhlaWdodD0iMjc0IiBzdHlsZT0iY29sb3I6IHJnYigwLCAwLCAwKTsiIGNsYXNzPSIiIGZpbGwtb3BhY2l0eT0iMSIvPjxnIGlkPSJzdXJmYWNlMSIgY2xhc3M9InNlbGVjdGVkIiBmaWxsPSIjNDE0MWU4IiBmaWxsLW9wYWNpdHk9IjEiPgo8cGF0aCBkPSJNIDIxNy45OTYwOTQgMTU4LjQ1NzAzMSBDIDE2NC4yMDMxMjUgMTU4LjQ1NzAzMSAxMjAuNDQxNDA2IDIwMi4yMTg3NSAxMjAuNDQxNDA2IDI1Ni4wMDc4MTIgQyAxMjAuNDQxNDA2IDMwOS44MDA3ODEgMTY0LjIwMzEyNSAzNTMuNTYyNSAyMTcuOTk2MDk0IDM1My41NjI1IEMgMjcxLjc4NTE1NiAzNTMuNTYyNSAzMTUuNTQ2ODc1IDMwOS44MDA3ODEgMzE1LjU0Njg3NSAyNTYuMDA3ODEyIEMgMzE1LjU0Njg3NSAyMDIuMjE4NzUgMjcxLjc4NTE1NiAxNTguNDU3MDMxIDIxNy45OTYwOTQgMTU4LjQ1NzAzMSBaIE0gMjc1LjkxNDA2MiAyMzcuNjM2NzE5IEwgMjA2LjAyNzM0NCAzMDcuNTIzNDM4IEMgMjAzLjA5Mzc1IDMxMC40NTcwMzEgMTk5LjI0NjA5NCAzMTEuOTI1NzgxIDE5NS40MDIzNDQgMzExLjkyNTc4MSBDIDE5MS41NTg1OTQgMzExLjkyNTc4MSAxODcuNzE0ODQ0IDMxMC40NjA5MzggMTg0Ljc4MTI1IDMwNy41MjM0MzggTCAxNTguMDc0MjE5IDI4MC44MTY0MDYgQyAxNTIuMjA3MDMxIDI3NC45NTMxMjUgMTUyLjIwNzAzMSAyNjUuNDQxNDA2IDE1OC4wNzQyMTkgMjU5LjU3NDIxOSBDIDE2My45Mzc1IDI1My43MDcwMzEgMTczLjQ0OTIxOSAyNTMuNzA3MDMxIDE3OS4zMTY0MDYgMjU5LjU3NDIxOSBMIDE5NS40MDIzNDQgMjc1LjY2MDE1NiBMIDI1NC42NzE4NzUgMjE2LjM5NDUzMSBDIDI2MC41MzUxNTYgMjEwLjUyNzM0NCAyNzAuMDQ2ODc1IDIxMC41MjczNDQgMjc1LjkxNDA2MiAyMTYuMzk0NTMxIEMgMjgxLjc4MTI1IDIyMi4yNTc4MTIgMjgxLjc4MTI1IDIzMS43Njk1MzEgMjc1LjkxNDA2MiAyMzcuNjM2NzE5IFogTSAyNzUuOTE0MDYyIDIzNy42MzY3MTkgIiBzdHlsZT0ic3Ryb2tlOiBub25lOyBmaWxsLXJ1bGU6IG5vbnplcm87IiBpZD0ic3ZnXzEiIGZpbGw9IiM0MTQxZTgiIGZpbGwtb3BhY2l0eT0iMSIvPgo8cGF0aCBkPSJNIDQzNS40ODgyODEgMTM4LjkxNzk2OSBMIDQzNS40NzI2NTYgMTM4LjUxOTUzMSBDIDQzNS4yNSAxMzMuNjAxNTYyIDQzNS4xMDE1NjIgMTI4LjM5ODQzOCA0MzUuMDExNzE5IDEyMi42MDkzNzUgQyA0MzQuNTkzNzUgOTQuMzc4OTA2IDQxMi4xNTIzNDQgNzEuMDI3MzQ0IDM4My45MTc5NjkgNjkuNDQ5MjE5IEMgMzI1LjA1MDc4MSA2Ni4xNjQwNjIgMjc5LjUxMTcxOSA0Ni45Njg3NSAyNDAuNjAxNTYyIDkuMDQyOTY5IEwgMjQwLjI2OTUzMSA4LjcyNjU2MiBDIDIyNy41NzgxMjUgLTIuOTEwMTU2IDIwOC40MzM1OTQgLTIuOTEwMTU2IDE5NS43MzgyODEgOC43MjY1NjIgTCAxOTUuNDA2MjUgOS4wNDI5NjkgQyAxNTYuNDk2MDk0IDQ2Ljk2ODc1IDExMC45NTcwMzEgNjYuMTY0MDYyIDUyLjA4OTg0NCA2OS40NTMxMjUgQyAyMy44NTkzNzUgNzEuMDI3MzQ0IDEuNDE0MDYyIDk0LjM3ODkwNiAwLjk5NjA5NCAxMjIuNjEzMjgxIEMgMC45MTAxNTYgMTI4LjM2MzI4MSAwLjc1NzgxMiAxMzMuNTY2NDA2IDAuNTM1MTU2IDEzOC41MTk1MzEgTCAwLjUxMTcxOSAxMzkuNDQ1MzEyIEMgLTAuNjMyODEyIDE5OS40NzI2NTYgLTIuMDU0Njg4IDI3NC4xNzk2ODggMjIuOTM3NSAzNDEuOTg4MjgxIEMgMzYuNjc5Njg4IDM3OS4yNzczNDQgNTcuNDkyMTg4IDQxMS42OTE0MDYgODQuNzkyOTY5IDQzOC4zMzU5MzggQyAxMTUuODg2NzE5IDQ2OC42Nzk2ODggMTU2LjYxMzI4MSA0OTIuNzY5NTMxIDIwNS44Mzk4NDQgNTA5LjkzMzU5NCBDIDIwNy40NDE0MDYgNTEwLjQ5MjE4OCAyMDkuMTA1NDY5IDUxMC45NDUzMTIgMjEwLjgwMDc4MSA1MTEuMjg1MTU2IEMgMjEzLjE5MTQwNiA1MTEuNzYxNzE5IDIxNS41OTc2NTYgNTEyIDIxOC4wMDM5MDYgNTEyIEMgMjIwLjQxMDE1NiA1MTIgMjIyLjgyMDMxMiA1MTEuNzYxNzE5IDIyNS4yMDcwMzEgNTExLjI4NTE1NiBDIDIyNi45MDIzNDQgNTEwLjk0NTMxMiAyMjguNTc4MTI1IDUxMC40ODgyODEgMjMwLjE4NzUgNTA5LjkyNTc4MSBDIDI3OS4zNTU0NjkgNDkyLjczMDQ2OSAzMjAuMDM5MDYyIDQ2OC42Mjg5MDYgMzUxLjEwNTQ2OSA0MzguMjg5MDYyIEMgMzc4LjM5NDUzMSA0MTEuNjM2NzE5IDM5OS4yMDcwMzEgMzc5LjIxNDg0NCA0MTIuOTYwOTM4IDM0MS45MTc5NjkgQyA0MzguMDQ2ODc1IDI3My45MDYyNSA0MzYuNjI4OTA2IDE5OS4wNTg1OTQgNDM1LjQ4ODI4MSAxMzguOTE3OTY5IFogTSAyMTcuOTk2MDk0IDM4My42MDU0NjkgQyAxNDcuNjM2NzE5IDM4My42MDU0NjkgOTAuMzk4NDM4IDMyNi4zNjcxODggOTAuMzk4NDM4IDI1Ni4wMDc4MTIgQyA5MC4zOTg0MzggMTg1LjY0ODQzOCAxNDcuNjM2NzE5IDEyOC40MTAxNTYgMjE3Ljk5NjA5NCAxMjguNDEwMTU2IEMgMjg4LjM1MTU2MiAxMjguNDEwMTU2IDM0NS41OTM3NSAxODUuNjQ4NDM4IDM0NS41OTM3NSAyNTYuMDA3ODEyIEMgMzQ1LjU5Mzc1IDMyNi4zNjcxODggMjg4LjM1MTU2MiAzODMuNjA1NDY5IDIxNy45OTYwOTQgMzgzLjYwNTQ2OSBaIE0gMjE3Ljk5NjA5NCAzODMuNjA1NDY5ICIgc3R5bGU9InN0cm9rZTogbm9uZTsgZmlsbC1ydWxlOiBub256ZXJvOyIgaWQ9InN2Z18yIiBmaWxsPSIjNDE0MWU4IiBmaWxsLW9wYWNpdHk9IjEiLz4KPC9nPjwvZz48L3N2Zz4=',
    dataSvgGradeLow: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNTEyLjAwMTQwMzgwODU5MzgiIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMiIgc3R5bGU9IiI+PHJlY3QgaWQ9ImJhY2tncm91bmRyZWN0IiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz4KCjxnIGNsYXNzPSJjdXJyZW50TGF5ZXIiIHN0eWxlPSIiPjx0aXRsZT5MYXllciAxPC90aXRsZT48ZyBjbGFzcz0ic2VsZWN0ZWQiPjxyZWN0IGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IiIgZmlsbC1ydWxlPSJub256ZXJvIiBpZD0ic3ZnXzMiIHg9Ijc2LjkxMzUzNjA3MTc3NzM0IiB5PSIxMjIuNzY4NzgzNTY5MzM1OTQiIHdpZHRoPSIyNzcuMTk1OTgzODg2NzE4NzUiIGhlaWdodD0iMjY3LjU0MzM2NTQ3ODUxNTYiIHN0eWxlPSJjb2xvcjogcmdiKDAsIDAsIDApOyIgY2xhc3M9IiIgZmlsbC1vcGFjaXR5PSIxIi8+PHJlY3QgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtZGFzaG9mZnNldD0iIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHg9Ijc2LjkxMzUzNjA3MTc3NzM0IiB5PSIxMjIuNzY4NzgzNTY5MzM1OTQiIHdpZHRoPSIyNzcuMTk1OTgzODg2NzE4NzUiIGhlaWdodD0iMjY3LjU0MzM2NTQ3ODUxNTYiIHN0eWxlPSJjb2xvcjogcmdiKDAsIDAsIDApOyIgY2xhc3M9IiIgZmlsbC1vcGFjaXR5PSIxIiBpZD0ic3ZnXzQiLz48ZyBpZD0ic3VyZmFjZTEiIGNsYXNzPSIiIGZpbGw9IiMwNGI4MDQiIGZpbGwtb3BhY2l0eT0iMSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utb3BhY2l0eT0iMSI+CjxwYXRoIGQ9Ik0yMTYuODQwMDI0NjAyMDczNjcsMTU4LjQ1NzAzMSBDMTYzLjA0NzA1NTYwMjA3MzY3LDE1OC40NTcwMzEgMTE5LjI4NTMzNjYwMjA3MzY3LDIwMi4yMTg3NSAxMTkuMjg1MzM2NjAyMDczNjcsMjU2LjAwNzgxMiBDMTE5LjI4NTMzNjYwMjA3MzY3LDMwOS44MDA3ODEgMTYzLjA0NzA1NTYwMjA3MzY3LDM1My41NjI1IDIxNi44NDAwMjQ2MDIwNzM2NywzNTMuNTYyNSBDMjcwLjYyOTA4NjYwMjA3MzY0LDM1My41NjI1IDMxNC4zOTA4MDU2MDIwNzM2NywzMDkuODAwNzgxIDMxNC4zOTA4MDU2MDIwNzM2NywyNTYuMDA3ODEyIEMzMTQuMzkwODA1NjAyMDczNjcsMjAyLjIxODc1IDI3MC42MjkwODY2MDIwNzM2NCwxNTguNDU3MDMxIDIxNi44NDAwMjQ2MDIwNzM2NywxNTguNDU3MDMxIHpNMjc0Ljc1Nzk5MjYwMjA3MzY3LDIzNy42MzY3MTkgTDIwNC44NzEyNzQ2MDIwNzM2NywzMDcuNTIzNDM4IEMyMDEuOTM3NjgwNjAyMDczNjcsMzEwLjQ1NzAzMSAxOTguMDkwMDI0NjAyMDczNjcsMzExLjkyNTc4MSAxOTQuMjQ2Mjc0NjAyMDczNjcsMzExLjkyNTc4MSBDMTkwLjQwMjUyNDYwMjA3MzY3LDMxMS45MjU3ODEgMTg2LjU1ODc3NDYwMjA3MzY3LDMxMC40NjA5MzggMTgzLjYyNTE4MDYwMjA3MzY3LDMwNy41MjM0MzggTDE1Ni45MTgxNDk2MDIwNzM2NywyODAuODE2NDA2IEMxNTEuMDUwOTYxNjAyMDczNjcsMjc0Ljk1MzEyNSAxNTEuMDUwOTYxNjAyMDczNjcsMjY1LjQ0MTQwNiAxNTYuOTE4MTQ5NjAyMDczNjcsMjU5LjU3NDIxOSBDMTYyLjc4MTQzMDYwMjA3MzY3LDI1My43MDcwMzEgMTcyLjI5MzE0OTYwMjA3MzY3LDI1My43MDcwMzEgMTc4LjE2MDMzNjYwMjA3MzY3LDI1OS41NzQyMTkgTDE5NC4yNDYyNzQ2MDIwNzM2NywyNzUuNjYwMTU2IEwyNTMuNTE1ODA1NjAyMDczNjcsMjE2LjM5NDUzMSBDMjU5LjM3OTA4NjYwMjA3MzY0LDIxMC41MjczNDQgMjY4Ljg5MDgwNTYwMjA3MzY3LDIxMC41MjczNDQgMjc0Ljc1Nzk5MjYwMjA3MzY3LDIxNi4zOTQ1MzEgQzI4MC42MjUxODA2MDIwNzM2NywyMjIuMjU3ODEyIDI4MC42MjUxODA2MDIwNzM2NywyMzEuNzY5NTMxIDI3NC43NTc5OTI2MDIwNzM2NywyMzcuNjM2NzE5IHpNMjc0Ljc1Nzk5MjYwMjA3MzY3LDIzNy42MzY3MTkgIiBzdHlsZT0iZmlsbC1ydWxlOiBub256ZXJvOyIgaWQ9InN2Z18xIiBmaWxsPSIjMDRiODA0IiBmaWxsLW9wYWNpdHk9IjEiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjEiLz4KPHBhdGggZD0iTTQzNC4zMzIyMTE2MDIwNzM2NCwxMzguOTE3OTY5IEw0MzQuMzE2NTg2NjAyMDczNjQsMTM4LjUxOTUzMSBDNDM0LjA5MzkzMDYwMjA3MzY3LDEzMy42MDE1NjIgNDMzLjk0NTQ5MjYwMjA3MzY3LDEyOC4zOTg0MzggNDMzLjg1NTY0OTYwMjA3MzcsMTIyLjYwOTM3NSBDNDMzLjQzNzY4MDYwMjA3MzY3LDk0LjM3ODkwNiA0MTAuOTk2Mjc0NjAyMDczNyw3MS4wMjczNDQgMzgyLjc2MTg5OTYwMjA3MzcsNjkuNDQ5MjE5IEMzMjMuODk0NzExNjAyMDczNjQsNjYuMTY0MDYyIDI3OC4zNTU2NDk2MDIwNzM3LDQ2Ljk2ODc1IDIzOS40NDU0OTI2MDIwNzM2Nyw5LjA0Mjk2OSBMMjM5LjExMzQ2MTYwMjA3MzY3LDguNzI2NTYyIEMyMjYuNDIyMDU1NjAyMDczNjcsLTIuOTEwMTU1OTk5OTk5OTk5NyAyMDcuMjc3NTI0NjAyMDczNjcsLTIuOTEwMTU1OTk5OTk5OTk5NyAxOTQuNTgyMjExNjAyMDczNjcsOC43MjY1NjIgTDE5NC4yNTAxODA2MDIwNzM2Nyw5LjA0Mjk2OSBDMTU1LjM0MDAyNDYwMjA3MzY3LDQ2Ljk2ODc1IDEwOS44MDA5NjE2MDIwNzM2Nyw2Ni4xNjQwNjIgNTAuOTMzNzc0NjAyMDczNjcsNjkuNDUzMTI1IEMyMi43MDMzMDU2MDIwNzM2Nyw3MS4wMjczNDQgMC4yNTc5OTI2MDIwNzM2NjkyNSw5NC4zNzg5MDYgLTAuMTU5OTc1Mzk3OTI2MzMwNDgsMTIyLjYxMzI4MSBDLTAuMjQ1OTEzMzk3OTI2MzMwNSwxMjguMzYzMjgxIC0wLjM5ODI1NzM5NzkyNjMzMDUsMTMzLjU2NjQwNiAtMC42MjA5MTMzOTc5MjYzMzA2LDEzOC41MTk1MzEgTC0wLjY0NDM1MDM5NzkyNjMzMDUsMTM5LjQ0NTMxMiBDLTEuNzg4ODgxMzk3OTI2MzMwNSwxOTkuNDcyNjU2IC0zLjIxMDc1NzM5NzkyNjMzMSwyNzQuMTc5Njg4IDIxLjc4MTQzMDYwMjA3MzY3LDM0MS45ODgyODEgQzM1LjUyMzYxODYwMjA3MzY3LDM3OS4yNzczNDQgNTYuMzM2MTE4NjAyMDczNjcsNDExLjY5MTQwNiA4My42MzY4OTk2MDIwNzM2Nyw0MzguMzM1OTM4IEMxMTQuNzMwNjQ5NjAyMDczNjcsNDY4LjY3OTY4OCAxNTUuNDU3MjExNjAyMDczNjcsNDkyLjc2OTUzMSAyMDQuNjgzNzc0NjAyMDczNjcsNTA5LjkzMzU5NCBDMjA2LjI4NTMzNjYwMjA3MzY3LDUxMC40OTIxODggMjA3Ljk0OTM5OTYwMjA3MzY3LDUxMC45NDUzMTIgMjA5LjY0NDcxMTYwMjA3MzY3LDUxMS4yODUxNTYgQzIxMi4wMzUzMzY2MDIwNzM2Nyw1MTEuNzYxNzE5MDAwMDAwMSAyMTQuNDQxNTg2NjAyMDczNjcsNTEyIDIxNi44NDc4MzY2MDIwNzM2Nyw1MTIgQzIxOS4yNTQwODY2MDIwNzM2Nyw1MTIgMjIxLjY2NDI0MjYwMjA3MzY3LDUxMS43NjE3MTkwMDAwMDAxIDIyNC4wNTA5NjE2MDIwNzM2Nyw1MTEuMjg1MTU2IEMyMjUuNzQ2Mjc0NjAyMDczNjcsNTEwLjk0NTMxMiAyMjcuNDIyMDU1NjAyMDczNjcsNTEwLjQ4ODI4MSAyMjkuMDMxNDMwNjAyMDczNjcsNTA5LjkyNTc4MSBDMjc4LjE5OTM5OTYwMjA3MzcsNDkyLjczMDQ2OSAzMTguODgyOTkyNjAyMDczNjcsNDY4LjYyODkwNiAzNDkuOTQ5Mzk5NjAyMDczNyw0MzguMjg5MDYyIEMzNzcuMjM4NDYxNjAyMDczNjQsNDExLjYzNjcxOSAzOTguMDUwOTYxNjAyMDczNjQsMzc5LjIxNDg0NCA0MTEuODA0ODY4NjAyMDczNjcsMzQxLjkxNzk2OSBDNDM2Ljg5MDgwNTYwMjA3MzY3LDI3My45MDYyNSA0MzUuNDcyODM2NjAyMDczNjQsMTk5LjA1ODU5NCA0MzQuMzMyMjExNjAyMDczNjQsMTM4LjkxNzk2OSB6TTIxNi44NDAwMjQ2MDIwNzM2NywzODMuNjA1NDY5IEMxNDYuNDgwNjQ5NjAyMDczNjcsMzgzLjYwNTQ2OSA4OS4yNDIzNjg2MDIwNzM2NywzMjYuMzY3MTg4IDg5LjI0MjM2ODYwMjA3MzY3LDI1Ni4wMDc4MTIgQzg5LjI0MjM2ODYwMjA3MzY3LDE4NS42NDg0MzggMTQ2LjQ4MDY0OTYwMjA3MzY3LDEyOC40MTAxNTYgMjE2Ljg0MDAyNDYwMjA3MzY3LDEyOC40MTAxNTYgQzI4Ny4xOTU0OTI2MDIwNzM2NywxMjguNDEwMTU2IDM0NC40Mzc2ODA2MDIwNzM2NywxODUuNjQ4NDM4IDM0NC40Mzc2ODA2MDIwNzM2NywyNTYuMDA3ODEyIEMzNDQuNDM3NjgwNjAyMDczNjcsMzI2LjM2NzE4OCAyODcuMTk1NDkyNjAyMDczNjcsMzgzLjYwNTQ2OSAyMTYuODQwMDI0NjAyMDczNjcsMzgzLjYwNTQ2OSB6TTIxNi44NDAwMjQ2MDIwNzM2NywzODMuNjA1NDY5ICIgc3R5bGU9ImZpbGwtcnVsZTogbm9uemVybzsiIGlkPSJzdmdfMiIgZmlsbD0iIzA0YjgwNCIgZmlsbC1vcGFjaXR5PSIxIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIxIi8+CjwvZz48L2c+PC9nPjwvc3ZnPg==',
    dataSvgGradeMedium: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNTEyLjAwMTQwMzgwODU5MzgiIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMiIgc3R5bGU9IiI+PHJlY3QgaWQ9ImJhY2tncm91bmRyZWN0IiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4PSIwIiB5PSIwIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz4KCjxnIGNsYXNzPSJjdXJyZW50TGF5ZXIiIHN0eWxlPSIiPjx0aXRsZT5MYXllciAxPC90aXRsZT48cmVjdCBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMyMjIyMjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWRhc2hvZmZzZXQ9IiIgZmlsbC1ydWxlPSJub256ZXJvIiBpZD0ic3ZnXzMiIHg9IjYyLjI5NjcwMzMzODYyMzA1IiB5PSIxMjYuNjkyMzA3OTQ5MDY2MTYiIHdpZHRoPSIzMTUiIGhlaWdodD0iMjc0IiBzdHlsZT0iY29sb3I6IHJnYigwLCAwLCAwKTsiIGNsYXNzPSIiIGZpbGwtb3BhY2l0eT0iMSIvPjxnIGlkPSJzdXJmYWNlMSIgY2xhc3M9InNlbGVjdGVkIiBmaWxsPSIjYjZiNmI2IiBmaWxsLW9wYWNpdHk9IjEiPgo8cGF0aCBkPSJNIDIxNy45OTYwOTQgMTU4LjQ1NzAzMSBDIDE2NC4yMDMxMjUgMTU4LjQ1NzAzMSAxMjAuNDQxNDA2IDIwMi4yMTg3NSAxMjAuNDQxNDA2IDI1Ni4wMDc4MTIgQyAxMjAuNDQxNDA2IDMwOS44MDA3ODEgMTY0LjIwMzEyNSAzNTMuNTYyNSAyMTcuOTk2MDk0IDM1My41NjI1IEMgMjcxLjc4NTE1NiAzNTMuNTYyNSAzMTUuNTQ2ODc1IDMwOS44MDA3ODEgMzE1LjU0Njg3NSAyNTYuMDA3ODEyIEMgMzE1LjU0Njg3NSAyMDIuMjE4NzUgMjcxLjc4NTE1NiAxNTguNDU3MDMxIDIxNy45OTYwOTQgMTU4LjQ1NzAzMSBaIE0gMjc1LjkxNDA2MiAyMzcuNjM2NzE5IEwgMjA2LjAyNzM0NCAzMDcuNTIzNDM4IEMgMjAzLjA5Mzc1IDMxMC40NTcwMzEgMTk5LjI0NjA5NCAzMTEuOTI1NzgxIDE5NS40MDIzNDQgMzExLjkyNTc4MSBDIDE5MS41NTg1OTQgMzExLjkyNTc4MSAxODcuNzE0ODQ0IDMxMC40NjA5MzggMTg0Ljc4MTI1IDMwNy41MjM0MzggTCAxNTguMDc0MjE5IDI4MC44MTY0MDYgQyAxNTIuMjA3MDMxIDI3NC45NTMxMjUgMTUyLjIwNzAzMSAyNjUuNDQxNDA2IDE1OC4wNzQyMTkgMjU5LjU3NDIxOSBDIDE2My45Mzc1IDI1My43MDcwMzEgMTczLjQ0OTIxOSAyNTMuNzA3MDMxIDE3OS4zMTY0MDYgMjU5LjU3NDIxOSBMIDE5NS40MDIzNDQgMjc1LjY2MDE1NiBMIDI1NC42NzE4NzUgMjE2LjM5NDUzMSBDIDI2MC41MzUxNTYgMjEwLjUyNzM0NCAyNzAuMDQ2ODc1IDIxMC41MjczNDQgMjc1LjkxNDA2MiAyMTYuMzk0NTMxIEMgMjgxLjc4MTI1IDIyMi4yNTc4MTIgMjgxLjc4MTI1IDIzMS43Njk1MzEgMjc1LjkxNDA2MiAyMzcuNjM2NzE5IFogTSAyNzUuOTE0MDYyIDIzNy42MzY3MTkgIiBzdHlsZT0ic3Ryb2tlOiBub25lOyBmaWxsLXJ1bGU6IG5vbnplcm87IiBpZD0ic3ZnXzEiIGZpbGw9IiNiNmI2YjYiIGZpbGwtb3BhY2l0eT0iMSIvPgo8cGF0aCBkPSJNIDQzNS40ODgyODEgMTM4LjkxNzk2OSBMIDQzNS40NzI2NTYgMTM4LjUxOTUzMSBDIDQzNS4yNSAxMzMuNjAxNTYyIDQzNS4xMDE1NjIgMTI4LjM5ODQzOCA0MzUuMDExNzE5IDEyMi42MDkzNzUgQyA0MzQuNTkzNzUgOTQuMzc4OTA2IDQxMi4xNTIzNDQgNzEuMDI3MzQ0IDM4My45MTc5NjkgNjkuNDQ5MjE5IEMgMzI1LjA1MDc4MSA2Ni4xNjQwNjIgMjc5LjUxMTcxOSA0Ni45Njg3NSAyNDAuNjAxNTYyIDkuMDQyOTY5IEwgMjQwLjI2OTUzMSA4LjcyNjU2MiBDIDIyNy41NzgxMjUgLTIuOTEwMTU2IDIwOC40MzM1OTQgLTIuOTEwMTU2IDE5NS43MzgyODEgOC43MjY1NjIgTCAxOTUuNDA2MjUgOS4wNDI5NjkgQyAxNTYuNDk2MDk0IDQ2Ljk2ODc1IDExMC45NTcwMzEgNjYuMTY0MDYyIDUyLjA4OTg0NCA2OS40NTMxMjUgQyAyMy44NTkzNzUgNzEuMDI3MzQ0IDEuNDE0MDYyIDk0LjM3ODkwNiAwLjk5NjA5NCAxMjIuNjEzMjgxIEMgMC45MTAxNTYgMTI4LjM2MzI4MSAwLjc1NzgxMiAxMzMuNTY2NDA2IDAuNTM1MTU2IDEzOC41MTk1MzEgTCAwLjUxMTcxOSAxMzkuNDQ1MzEyIEMgLTAuNjMyODEyIDE5OS40NzI2NTYgLTIuMDU0Njg4IDI3NC4xNzk2ODggMjIuOTM3NSAzNDEuOTg4MjgxIEMgMzYuNjc5Njg4IDM3OS4yNzczNDQgNTcuNDkyMTg4IDQxMS42OTE0MDYgODQuNzkyOTY5IDQzOC4zMzU5MzggQyAxMTUuODg2NzE5IDQ2OC42Nzk2ODggMTU2LjYxMzI4MSA0OTIuNzY5NTMxIDIwNS44Mzk4NDQgNTA5LjkzMzU5NCBDIDIwNy40NDE0MDYgNTEwLjQ5MjE4OCAyMDkuMTA1NDY5IDUxMC45NDUzMTIgMjEwLjgwMDc4MSA1MTEuMjg1MTU2IEMgMjEzLjE5MTQwNiA1MTEuNzYxNzE5IDIxNS41OTc2NTYgNTEyIDIxOC4wMDM5MDYgNTEyIEMgMjIwLjQxMDE1NiA1MTIgMjIyLjgyMDMxMiA1MTEuNzYxNzE5IDIyNS4yMDcwMzEgNTExLjI4NTE1NiBDIDIyNi45MDIzNDQgNTEwLjk0NTMxMiAyMjguNTc4MTI1IDUxMC40ODgyODEgMjMwLjE4NzUgNTA5LjkyNTc4MSBDIDI3OS4zNTU0NjkgNDkyLjczMDQ2OSAzMjAuMDM5MDYyIDQ2OC42Mjg5MDYgMzUxLjEwNTQ2OSA0MzguMjg5MDYyIEMgMzc4LjM5NDUzMSA0MTEuNjM2NzE5IDM5OS4yMDcwMzEgMzc5LjIxNDg0NCA0MTIuOTYwOTM4IDM0MS45MTc5NjkgQyA0MzguMDQ2ODc1IDI3My45MDYyNSA0MzYuNjI4OTA2IDE5OS4wNTg1OTQgNDM1LjQ4ODI4MSAxMzguOTE3OTY5IFogTSAyMTcuOTk2MDk0IDM4My42MDU0NjkgQyAxNDcuNjM2NzE5IDM4My42MDU0NjkgOTAuMzk4NDM4IDMyNi4zNjcxODggOTAuMzk4NDM4IDI1Ni4wMDc4MTIgQyA5MC4zOTg0MzggMTg1LjY0ODQzOCAxNDcuNjM2NzE5IDEyOC40MTAxNTYgMjE3Ljk5NjA5NCAxMjguNDEwMTU2IEMgMjg4LjM1MTU2MiAxMjguNDEwMTU2IDM0NS41OTM3NSAxODUuNjQ4NDM4IDM0NS41OTM3NSAyNTYuMDA3ODEyIEMgMzQ1LjU5Mzc1IDMyNi4zNjcxODggMjg4LjM1MTU2MiAzODMuNjA1NDY5IDIxNy45OTYwOTQgMzgzLjYwNTQ2OSBaIE0gMjE3Ljk5NjA5NCAzODMuNjA1NDY5ICIgc3R5bGU9InN0cm9rZTogbm9uZTsgZmlsbC1ydWxlOiBub256ZXJvOyIgaWQ9InN2Z18yIiBmaWxsPSIjYjZiNmI2IiBmaWxsLW9wYWNpdHk9IjEiLz4KPC9nPjwvZz48L3N2Zz4=',
    // relaciones ID del servicio de infoplayas_catalogo_edicion y los nombres de la propiedad para acceder en el codigo
    relDanger: ['0', 'Danger'],
    relAfluencia: ['1', 'Afluencia'],
    relHumanos: ['2', 'Humanos'],
    relEntorno: ['3', 'Entorno'],
    relIncidencias: ['4', 'Incidencias'],
    relBalizamiento: ['5', 'Balizamiento'],
    relInformativo: ['6', 'Informativo'],
    relPuesto: ['7', 'Puesto'],
    relPasiva: ['8', 'Pasiva'],
    relRiesgos: ['9', 'Riesgos'],
    // ID de las tablas del servicio de infoplayas_catalogo_edicion
    tbClasificacion: 1,
    tbAfluencia: 4,
    tbHumanos: 5,
    tbEntorno: 3,
    tbIncidencias: 2,
    tbBalizamiento: 6,
    tbInformativo: 7,
    tbPuesto: 8,
    tbPasiva: 9,
    tbRiesgos: 11,
    tbUnitarios: 10,
    tbVacacional: 12
};
