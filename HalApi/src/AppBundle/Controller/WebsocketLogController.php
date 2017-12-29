<?php

namespace AppBundle\Controller;

use AppBundle\Entity\WebsocketLog;
use AppBundle\Request\WebsocketLogRequest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Utils\JsonFromDbObjectConverter;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;


class WebsocketLogController extends Controller
{
	/**
	 * @Route("/api/websocket-log")
	 * @Method("POST")
	 * @param Request $request
	 * @param JsonFromDbObjectConverter $converter
	 * @return JsonResponse
	 */
	public function websocketLogPostAction(Request $request, JsonFromDbObjectConverter $converter): JsonResponse
	{
		$websocketLogRequest = new WebsocketLogRequest();
		$websocketLogRequest->from = $request->get('from');
		$websocketLogRequest->to = $request->get('to');
		$websocketLogRequest->data = $request->get('data');
		$websocketLogRequest->event = $request->get('event');

		$validator = $this->get('validator');
		$websocketLogRequestErrors = $validator->validate($websocketLogRequest);
		if (count($websocketLogRequestErrors) > 0) {
			$errorService = $this->container->get('app.error_service');
			$errorsArray = $errorService->getArrayWithErrors($websocketLogRequestErrors);
			return new JsonResponse($errorsArray, JsonResponse::HTTP_BAD_REQUEST);
		}

		$result = $this->createWebsocketLog($websocketLogRequest);
		$data = $converter->convertObjectToJson($result);

		return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
	}

	private function createWebsocketLog(WebsocketLogRequest $websocketLogRequest): WebsocketLog
	{
		$websocketLog = new WebsocketLog();
		$websocketLog->setClientFrom($websocketLogRequest->from);
		$websocketLog->setClientTo($websocketLogRequest->to);
		$websocketLog->setData($websocketLogRequest->data);
		$websocketLog->setEvent($websocketLogRequest->event);
		$websocketLog->setCreatedAt(new \DateTime());
		$websocketLog->setUpdatedAt(new \DateTime());

		$em = $this->getDoctrine()->getManager();
		$em->persist($websocketLog);
		$em->flush();

		return $websocketLog;
	}
}
