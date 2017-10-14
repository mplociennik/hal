<?php

namespace AppBundle\Controller;

use Boris\Config;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\Config as HalConfig;

class ConfigController extends Controller
{
    /**
     * @Route("/api/config", name="config")
     */
    public function indexAction()
    {
        $logger = $this->container->get('logger');
        $logger->info('Get config init...');
        $repository = $this->getDoctrine()
            ->getRepository(HalConfig::class);
        $data = $repository->find(1);
        if ($data) {
            $responseData = $this->mapConfigData($data);

        } else {
            $responseData = ['code' => 404, 'message' => 'record not found'];
        }
        $response = new Response(json_encode($responseData));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    private function mapConfigData($config)
    {
        return [
            'code' => 200,
            'websocket_server_address' => $config->getWebsocketServerAddress(),
            'language' => $config->getLanguage()
        ];
    }
}
