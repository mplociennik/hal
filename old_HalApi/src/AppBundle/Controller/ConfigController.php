<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Config as HalConfig;


/**
 * Class ConfigController
 * @package AppBundle\Controller
 */
class ConfigController extends Controller
{
    /**
     * @Route("/api/config", name="config")
	 * @Method('POST')
	 * @return JsonResponse
     */
    public function indexAction(): JsonResponse
    {
        $logger = $this->container->get('logger');
        $logger->info('Get config init...');
        $repository = $this->getDoctrine()
            ->getRepository(HalConfig::class);
        $data = $repository->find(1);
        if ($data) {
            $responseData = $this->mapConfigData($data);

        } else {
			$responseData['message'] = 'Config not found.';
			return new JsonResponse(json_encode($responseData), JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(json_encode($responseData), JsonResponse::HTTP_NEW);
    }

    private function mapConfigData($config)
    {
        return [
            'websocket_server_address' => $config->getWebsocketServerAddress(),
            'language' => $config->getLanguage()
        ];
    }
}
