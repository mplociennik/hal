<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;

class ConversationController extends Controller
{
    /**
     * @Route("/api/conversation")
	 * @Method("GET")
     */
    public function conversationPostAction()
    {
        
    }

    /**
     * @Route("/api/conversation/{id}")
	 * @Method("GET")
     */
    public function conversationGetAction($id)
    {
        return $this->render('AppBundle:ConversationController:conversation_get.html.twig', array(
            // ...
        ));
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
        return $this->render('AppBundle:ConversationController:conversation_patch.html.twig', array(
            // ...
        ));
    }

}
