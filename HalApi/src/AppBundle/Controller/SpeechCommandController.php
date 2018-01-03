<?php

namespace AppBundle\Controller;

use AppBundle\DependencyInjection\SpeechCommandService;
use AppBundle\Entity\SpeechCommand;
use AppBundle\Request\SpeechCommandRequest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Utils\JsonFromDbObjectConverter;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;


class SpeechCommandController extends Controller
{
	/**
	 * @Route("/api/speech-command")
	 * @Method("POST")
	 * @param Request $request
	 * @param JsonFromDbObjectConverter $converter
	 * @return JsonResponse
	 * @throws \Doctrine\ORM\OptimisticLockException
	 */
	public function speechCommandPostAction(Request $request, JsonFromDbObjectConverter $converter): JsonResponse
	{
		$speechCommandRequest = new SpeechCommandRequest();
		$speechCommandRequest->command = $request->get('command');
		$speechCommandRequest->languageId = $request->get('languageId') ? (int)$request->get('languageId') : null;
		$speechCommandRequest->wsMessages = $request->get('wsMessages');

		$validator = $this->get('validator');
		$speechCommandRequestErrors = $validator->validate($speechCommandRequest);
		if (count($speechCommandRequestErrors) > 0) {
			$errorService = $this->container->get('app.error_service');
			$errorsArray = $errorService->getArrayWithErrors($speechCommandRequestErrors);
			return new JsonResponse($errorsArray, JsonResponse::HTTP_BAD_REQUEST);
		}

		/** @var SpeechCommandService $speechCommandService */
		$speechCommandService = $this->container->get('app.speech_command_service');
		$result = $speechCommandService->createSpeechCommand($speechCommandRequest);
		$data = $converter->convertObjectToJson($result);

		return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
	}

	/**
	 * @Route("/api/speech-command")
	 * @Method("GET")
	 * @param $id
	 * @param JsonFromDbObjectConverter $converter
	 */
	public function speechCommandsGetAction(JsonFromDbObjectConverter $converter)
	{
		$results = $this->getDoctrine()->getRepository(SpeechCommand::class)->findAll();

		if (!$results) {
			$data['message'] = 'Speech commands not found...';
			return new JsonResponse($data, JsonResponse::HTTP_NOT_FOUND);
		}

		$data = $converter->convertObjectToJson($results);

		return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
	}
}
