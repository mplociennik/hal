<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Conversation;
use AppBundle\Entity\Sentence;
use AppBundle\Request\ConversationRequest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Utils\JsonFromDbObjectConverter;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class ConversationController
 * @package AppBundle\Controller
 */
class ConversationController extends Controller
{
	/**
	 * @Route("/api/conversation")
	 * @Method("POST")
	 * @param Request $request
	 * @param JsonFromDbObjectConverter $converter
	 * @return JsonResponse
	 */
	public function conversationPostAction(Request $request, JsonFromDbObjectConverter $converter)
	{

		$conversationRequest = new ConversationRequest();
		$conversationRequest->sentenceA = $request->get('sentenceA');
		$conversationRequest->sentenceB = $request->get('sentenceB');

		$validator = $this->get('validator');

		$conversationRequestErrors = $validator->validate($conversationRequest);
		if (count($conversationRequestErrors) > 0) {
			$errorService = $this->container->get('app.error_service');
			$errorsArray = $errorService->getArrayWithErrors($conversationRequestErrors);
			return new JsonResponse($errorsArray, JsonResponse::HTTP_BAD_REQUEST);
		}

		$sentenceService = $this->container->get('app.sentence_service');

		$sentenceA = $sentenceService->findOrCreate($conversationRequest->sentenceA);
		$sentenceB = $sentenceService->findOrCreate($conversationRequest->sentenceB);
		$result = $this->createConversation($sentenceA, $sentenceB);
		$data = $converter->convertObjectToJson($result);

		return new JsonResponse(json_decode($data), JsonResponse::HTTP_OK);
	}

	private function createConversation(Sentence $sentenceA, Sentence $sentenceB):Conversation
	{
		$conversation = new Conversation();
		$conversation->setSentenceA($sentenceA);
		$conversation->setSentenceB($sentenceB);
		$conversation->setCreatedAt(new \DateTime());
		$conversation->setUpdatedAt(new \DateTime());
		return $conversation;
	}

	/**
	 * @Route("/api/conversation/{id}")
	 * @Method("GET")
	 */
	public function conversationGetAction($id)
	{

	}

	/**
	 * @Route("/api/conversation-tree/{id}")
	 * @Method("GET")
	 */
	public function conversationTreeGetAction($id): JsonResponse
	{
		$data = [];
		return new JsonResponse(json_decode($data));
	}

	/**
	 * @Route("/api/conversation/{id}")
	 */
	public function conversationPatchAction($id)
	{

	}

}
